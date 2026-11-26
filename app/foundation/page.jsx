import SitePage from "../../components/site-page";
import { readPage } from "../../lib/read-page";

export const metadata = {
  title: "Foundation | FREN Inc.",
  robots: { index: false },
};

export default async function Page() {
  return <SitePage html={await readPage("foundation")} />;
}
