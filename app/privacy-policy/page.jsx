import SitePage from "../../components/site-page";
import { readPage } from "../../lib/read-page";

export const metadata = {
  title: "Privacy Policy | FREN Inc.",
  description: "How FREN handles website information, project inquiries and privacy requests.",
};

export default async function Page() {
  return <SitePage html={await readPage("privacy-policy")} />;
}
