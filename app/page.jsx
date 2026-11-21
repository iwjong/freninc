import SitePage from "../components/site-page";
import { inProgress, projects } from "../content/projects";
import { readPage } from "../lib/read-page";
import { renderHome } from "../lib/render-home";
import "./home.css";

export const metadata = {
  title: "FREN Inc. | Spaces for Care and Play",
  description: "Experience design, immersive environments and creative technology for museums, healthcare, education and public spaces. Based in Richmond Hill, Georgia.",
};

export default async function Page() {
  const home = renderHome(projects, inProgress);
  const html = (await readPage("home"))
    .replace("<!-- home-hero -->", home.hero)
    .replace("<!-- home-selected -->", home.selected)
    .replace("<!-- home-category-projects -->", home.projectsCategory)
    .replace("<!-- home-category-progress -->", home.progressCategory);
  return <SitePage html={html} />;
}
