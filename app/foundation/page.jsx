import SitePage from "../../components/site-page";
import { readPage } from "../../lib/read-page";

export default async function Page() {
  return <SitePage html={await readPage("foundation")} />;
}
