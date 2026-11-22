import SitePage from "../../components/site-page";
import { readPage } from "../../lib/read-page";
import "./contact.css";

export const metadata = {
  title: "Contact | FREN Inc.",
  description: "Talk with FREN about a new project, design consulting or a creative collaboration.",
};

export default async function Page() {
  const html = (await readPage("contact"))
    .replace("<!-- delivery-note -->", "")
    .replace("<!-- submit-label -->", "Send inquiry");
  return <SitePage html={html} />;
}
