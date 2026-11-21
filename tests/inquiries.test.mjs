import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { deliveryMode, validateInquiry, handleInquiry } from "../lib/inquiries.mjs";

const sample = (extra = {}) => ({ inquiryType: "project", name: "FREN Test", email: `${randomUUID()}@example.com`, organization: "Test Studio", services: ["Art & storytelling"], message: "A synthetic test of the FREN inquiry form.", consent: true, submissionId: randomUUID(), ...extra });
const request = (data, headers = {}) => new Request("http://localhost/api/inquiries", { method: "POST", headers: { origin: "http://localhost", "content-type": "application/json", ...headers }, body: JSON.stringify(data) });
const localEnv = { NODE_ENV: "test" };

test("validates every inquiry type and discards irrelevant conditional fields", () => {
 assert.deepEqual(validateInquiry(sample({ services: undefined })).errors, {});
 for (const type of ["project", "consulting", "collaboration", "general"]) {
  const result = validateInquiry(sample({ inquiryType: type, website: "https://example.com", budget: "$50k", discipline: "Illustration" }));
  assert.deepEqual(result.errors, {});
  if (type === "general") { assert.equal(result.data.budget, undefined); assert.equal(result.data.website, undefined); }
 }
});
test("rejects invalid names, email, consent, URL, type, service and traversal ID", () => {
 const result = validateInquiry(sample({ name: "  ", email: "invalid", consent: false, inquiryType: "__proto__", submissionId: "../../test" }));
 for (const name of ["name", "email", "consent", "inquiryType", "submissionId"]) assert.ok(result.errors[name]);
 assert.ok(validateInquiry(sample({ services: ["not available"] })).errors.services);
 assert.ok(validateInquiry(sample({ inquiryType: "collaboration", website: "javascript:alert(1)" })).errors.website);
 assert.ok(validateInquiry(sample({ message: "x".repeat(5001) })).errors.message);
});
test("rejects cross-origin, oversized, malformed and honeypot requests", async () => {
 assert.equal((await handleInquiry(request(sample(), { origin: "https://other.example" }), { env: localEnv })).status, 403);
 assert.equal((await handleInquiry(request({ message: "x".repeat(25000) }), { env: localEnv })).status, 413);
 assert.equal((await handleInquiry(new Request("http://localhost/api/inquiries", { method: "POST", headers: { origin: "http://localhost", "content-type": "application/json" }, body: "{" }), { env: localEnv })).status, 400);
 assert.equal((await handleInquiry(request(sample({ fax: "spam" })), { env: localEnv })).status, 400);
});
test("saves local inquiries, preserves exact data and deduplicates retries", async () => {
 const directory = await mkdtemp(path.join(tmpdir(), "fren-inquiry-test-"));
 try {
  const env = { NODE_ENV: "test", CONTACT_LOCAL_DIR: directory };
  const data = sample();
  const first = await handleInquiry(request(data), { env });
  assert.equal(first.status, 200);
  assert.equal((await first.json()).delivery, "local");
  const saved = JSON.parse(await readFile(path.join(directory, `${data.submissionId}.json`), "utf8"));
  assert.equal(saved.inquiry.message, data.message);
  assert.equal(saved.delivery, "local-only");
  assert.equal((await handleInquiry(request(data), { env })).status, 200);
  assert.equal((await readdir(directory)).length, 1);
  assert.equal((await handleInquiry(request({ ...data, message: "Changed content must not overwrite the original inquiry." }), { env })).status, 409);
 } finally {
  assert.ok(path.resolve(directory).startsWith(path.resolve(tmpdir()) + path.sep + "fren-inquiry-test-"));
  await rm(directory, { recursive: true });
 }
});
test("production does not silently save local files or claim delivery without configuration", async () => {
 assert.equal(deliveryMode({ NODE_ENV: "production" }), "unavailable");
 assert.equal((await handleInquiry(request(sample()), { env: { NODE_ENV: "production" } })).status, 503);
});

test("uses the browser-facing Host when Next resolves the request internally", async () => {
 const response = await handleInquiry(request(sample(), { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000" }), { env: { NODE_ENV: "production" } });
 assert.equal(response.status, 503);
 assert.equal((await handleInquiry(request(sample(), { host: "127.0.0.1:3000", origin: "https://other.example" }), { env: localEnv })).status, 403);
});
test("configured email uses fixed recipient, reply-to and idempotency; provider failure is not success", async () => {
 const env = { NODE_ENV: "production", RESEND_API_KEY: "test-key", CONTACT_FROM: "FREN <website@example.com>", CONTACT_TO: "studio@example.com" };
 const data = sample();
 const fetchImpl = async (url, options) => {
  assert.equal(url, "https://api.resend.com/emails");
  const payload = JSON.parse(options.body);
  assert.deepEqual(payload.to, [env.CONTACT_TO]);
  assert.equal(payload.reply_to, data.email);
  assert.equal(options.headers["Idempotency-Key"], `inquiry/${data.submissionId}`);
  assert.ok(payload.text.includes(data.message));
  return Response.json({ id: "mock-delivery" });
 };
 assert.equal((await handleInquiry(request(data), { env, fetchImpl })).status, 200);
 const failed = await handleInquiry(request(sample()), { env, fetchImpl: async () => Response.json({ error: "Unavailable" }, { status: 503 }) });
 assert.equal(failed.status, 502);
});
test("throttles repeated attempts", async () => {
 const data = sample();
 const env = { NODE_ENV: "production", RESEND_API_KEY: "test-key", CONTACT_FROM: "test@example.com", CONTACT_TO: "test@example.com" };
 const fetchImpl = async () => Response.json({ id: "mock" });
 for (let i = 0; i < 5; i++) assert.equal((await handleInquiry(request(data), { env, fetchImpl })).status, 200);
 assert.equal((await handleInquiry(request(data), { env, fetchImpl })).status, 429);
});
