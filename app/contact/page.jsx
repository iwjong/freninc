import SitePage from "../../components/site-page";
import { readPage } from "../../lib/read-page";
import { deliveryMode } from "../../lib/inquiries.mjs";
import "./contact.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Contact | FREN Inc.",
  description: "Talk with FREN about a new project, design consulting or a creative collaboration.",
};

export default async function Page() {
  const mode = deliveryMode();
  const note = mode === "local"
    ? '<p class="contact-delivery-note">Local preview: this form saves inquiries on this computer. Email delivery is not connected yet.</p>'
    : mode === "unavailable" ? '<p class="contact-delivery-note">Online inquiries are temporarily unavailable. Please email <a href="mailto:support@freninc.com">support@freninc.com</a>.</p>' : "";
  const html = (await readPage("contact"))
    .replace("<!-- delivery-note -->", note)
    .replace("<!-- submit-label -->", mode === "local" ? "Save inquiry locally" : "Send inquiry");
  return <SitePage html={html} />;
}
