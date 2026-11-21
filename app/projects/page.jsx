import SitePage from "../../components/site-page";
import { inProgress, projects } from "../../content/projects";
import { readPage } from "../../lib/read-page";
import { renderProjects } from "../../lib/render-projects";

export const metadata = {
  title: "Projects | FREN Inc.",
  description: "Explore FREN projects for Telfair Museums, UVA Health Children's, HCA Memorial Health and Studer Family Children's Hospital.",
};

export default async function Page() {
  const page = await readPage("projects");
  const contact = inProgress.length
    ? ""
    : `<p class="body copy-lead"><a class="cta-small" href="mailto:support@freninc.com">Ask about current work</a></p>`;
  const html = page
    .replace("<!-- project-list -->", renderProjects(projects))
    .replace("<!-- in-progress-list -->", renderProjects(inProgress))
    .replace("<!-- in-progress-contact -->", contact);
  return <SitePage html={html} />;
}
