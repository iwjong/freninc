import SitePage from "../../components/site-page";
import { studioEmail } from "../../lib/inquiry";
import { readPage } from "../../lib/read-page";
import "./contact.css";

export const metadata = {
  title: "Contact | FREN Inc.",
  description: "Talk with FREN about a new project, design consulting or a creative collaboration.",
  alternates: { canonical: "/contact" },
};

export default async function Page() {
  const formId = process.env.FREN_INQUIRY_FORM_ID?.trim() ?? "";
  const endpoint = /^[a-z0-9]+$/i.test(formId) ? `https://formspree.io/f/${formId}` : "";
  const emailLink = `<a href="mailto:${studioEmail}">${studioEmail}</a>`;
  const deliveryNote = endpoint
    ? `You can also email ${emailLink}.`
    : `This form opens an email draft addressed to ${emailLink}. Review and send it from your email app.`;

  const html = (await readPage("contact"))
    .replace("<!-- inquiry-endpoint -->", endpoint ? `data-inquiry-endpoint="${endpoint}"` : "")
    .replace("<!-- delivery-note -->", `<p class="contact-delivery-note">${deliveryNote}</p>`)
    .replace("<!-- submit-label -->", endpoint ? "Send inquiry" : "Open email draft");
  return <SitePage html={html} />;
}
