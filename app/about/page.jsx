import SitePage from "../../components/site-page";
import { readPage } from "../../lib/read-page";
import "./about.css";

export const metadata = {
  title: "About | FREN Inc.",
  description: "Meet FREN, an experience design studio in Richmond Hill, Georgia, connecting physical environments, original content and interactive media.",
};

export default async function Page() {
  return <SitePage html={await readPage("about")} />;
}
