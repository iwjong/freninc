import SitePage from "../../components/site-page";
import { readPage } from "../../lib/read-page";
import "./about.css";

export const metadata = {
  title: "About the Studio | FREN Inc.",
  description: "Meet the FREN team and learn how we approach experience design, from early conversations and research through design and delivery.",
  alternates: { canonical: "/about" },
};

export default async function Page() {
  return <SitePage html={await readPage("about")} />;
}
