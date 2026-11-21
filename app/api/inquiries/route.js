import { handleInquiry } from "../../../lib/inquiries.mjs";

export const runtime = "nodejs";

export async function POST(request) {
  return handleInquiry(request);
}
