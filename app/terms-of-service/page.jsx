import SitePage from "../../components/site-page";
import { readPage } from "../../lib/read-page";

export const metadata = {
  title: "Terms of Service | FREN Inc.",
  description: "Terms for using the FREN website, viewing our work and discussing design services.",
};

export default async function Page() {
  return <SitePage html={await readPage("terms-of-service")} />;
}
