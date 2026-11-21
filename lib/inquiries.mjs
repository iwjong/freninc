import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const types = { project: "New project", consulting: "Consulting", collaboration: "Collaboration", general: "General inquiry" };
const services = ["Spaces & environments", "Interactive experiences", "Art & storytelling", "Brand & wayfinding", "Strategy & research"];
const attempts = new Map();
const reply = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export function deliveryMode(env = process.env) {
  if (env.RESEND_API_KEY && env.CONTACT_FROM && env.CONTACT_TO) return "email";
  return env.NODE_ENV === "development" || env.NODE_ENV === "test" ? "local" : "unavailable";
}

export function validateInquiry(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { errors: { message: "Please check your inquiry." } };
  const errors = {};
  const data = {};
  const text = (name, max, min = 0) => {
    const value = input[name] ?? "";
    if (typeof value !== "string" || value.length > max || value.trim().length < min || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) {
      errors[name] = `Please enter ${min ? `${min} to ` : "no more than "}${max} characters.`;
      return "";
    }
    return value.trim();
  };
  data.inquiryType = text("inquiryType", 20);
  if (!Object.hasOwn(types, data.inquiryType)) errors.inquiryType = "Choose an inquiry type.";
  data.name = text("name", 100, 2);
  data.email = text("email", 254, 3);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email address.";
  data.organization = text("organization", 120);
  data.message = text("message", 5000, 20);
  if (input.consent !== true) errors.consent = "Please acknowledge the Privacy Policy.";
  data.consent = input.consent === true;
  if (["project", "consulting"].includes(data.inquiryType)) {
    data.timing = text("timing", 120);
    data.budget = text("budget", 100);
    const selected = input.services ?? [];
    if (!Array.isArray(selected) || selected.length > services.length || selected.some(value => !services.includes(value))) errors.services = "Choose services from the available options.";
    data.services = [...new Set(Array.isArray(selected) ? selected.filter(value => services.includes(value)) : [])];
  }
  if (data.inquiryType === "collaboration") {
    data.discipline = text("discipline", 120);
    data.website = text("website", 500);
    if (data.website) {
      try { const url = new URL(data.website); if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw Error(); }
      catch { errors.website = "Enter a website beginning with https:// or http://."; }
    }
  }
  if (typeof input.submissionId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.submissionId)) errors.submissionId = "Please reload this page and try again.";
  return { data, errors };
}

export async function handleInquiry(request, { env = process.env, fetchImpl = fetch } = {}) {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  const expectedOrigin = `${url.protocol}//${request.headers.get("host") || url.host}`;
  if (!origin || origin !== expectedOrigin) return reply({ message: "Please send your inquiry from the FREN website." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ message: "Unsupported submission format." }, 415);
  let input;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw Error();
    const chunks = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 24000) { await reader.cancel(); return reply({ message: "Your inquiry is too long. Please shorten it and try again." }, 413); }
      chunks.push(Buffer.from(value));
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return reply({ message: "Please check the form and try again." }, 400); }
  if (input?.fax) return reply({ message: "Please email support@freninc.com to continue your inquiry." }, 400);
  const { data, errors } = validateInquiry(input);
  if (Object.keys(errors).length) return reply({ message: "Please check the highlighted fields.", errors }, 400);
  const mode = deliveryMode(env);
  if (mode === "unavailable") return reply({ message: "The inquiry form is temporarily unavailable. Please email support@freninc.com. Your answers have not been sent." }, 503);
  const now = Date.now();
  for (const [key, record] of attempts) if (record.until < now) attempts.delete(key);
  // shortcut: this throttle is per server process; use a shared limiter before scaling to multiple instances.
  const key = createHash("sha256").update(data.email.toLowerCase()).digest("hex");
  const record = attempts.get(key) || { count: 0, until: now + 60000 };
  if (record.count >= 5 || (!attempts.has(key) && attempts.size >= 1000)) return reply({ message: "Please wait a minute before trying again." }, 429);
  record.count += 1;
  attempts.set(key, record);
  const id = input.submissionId;
  if (mode === "local") {
    const directory = env.CONTACT_LOCAL_DIR || path.join(process.cwd(), ".data", "inquiries");
    const file = path.join(directory, `${id}.json`);
    try {
      await mkdir(directory, { recursive: true, mode: 0o700 });
      const record = { id, receivedAt: new Date().toISOString(), delivery: "local-only", inquiry: data };
      try { await writeFile(file, JSON.stringify(record, null, 2), { flag: "wx", mode: 0o600 }); }
      catch (error) {
        if (error.code !== "EEXIST") throw error;
        const previous = JSON.parse(await readFile(file, "utf8"));
        if (JSON.stringify(previous.inquiry) !== JSON.stringify(data)) return reply({ message: "This submission changed. Please reload the page before sending it again." }, 409);
      }
      return reply({ id, delivery: "local", message: "Your inquiry was saved on this local preview. No email has been sent. For a reply from FREN, email support@freninc.com." });
    } catch { return reply({ message: "We could not save your inquiry. Your answers are still here; please try again." }, 503); }
  }
  const text = [
    `Inquiry: ${types[data.inquiryType]}`, `Name: ${data.name}`, `Email: ${data.email}`,
    `Organization: ${data.organization || "Not specified"}`,
    data.services && `Interests: ${data.services.join(", ") || "Open to discussion"}`,
    data.timing && `Timing: ${data.timing}`, data.budget && `Budget: ${data.budget}`,
    data.discipline && `Discipline: ${data.discipline}`, data.website && `Website: ${data.website}`,
    "", "Message:", data.message, "", "Privacy acknowledgement: accepted", `Reference: ${id}`,
  ].filter(value => value !== undefined && value !== false).join("\n");
  try {
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `inquiry/${id}` },
      body: JSON.stringify({ from: env.CONTACT_FROM, to: [env.CONTACT_TO], reply_to: data.email, subject: `FREN website / ${types[data.inquiryType]}`, text }),
      signal: AbortSignal.timeout(12000),
    });
    const result = await response.json();
    if (!response.ok || typeof result.id !== "string") throw Error();
    return reply({ id, delivery: "email", message: "Thank you. Your inquiry has been sent to FREN. We'll reply to the email address you shared." });
  } catch { return reply({ message: "We could not confirm delivery. Your answers are still here. Please try again or email support@freninc.com." }, 502); }
}
