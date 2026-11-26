import SitePage from "../../components/site-page";
import { inProgress, projects } from "../../content/projects";
import { readPage } from "../../lib/read-page";
import { renderProjects } from "../../lib/render-projects";
import "./projects.css";

export const metadata = {
  title: "Experience Design Projects | FREN Inc.",
  description: "Explore FREN’s work in exhibition design, environmental graphics, wayfinding, and interactive experiences, from Telfair Museums to UVA Health Children’s.",
  alternates: { canonical: "/projects" },
};

export default async function Page() {
  const page = await readPage("projects");
  const contact = inProgress.length
    ? ""
    : `<p class="body copy-lead"><a class="cta-small" href="/contact">Ask about current work</a></p>`;
  const html = page
    .replace("<!-- project-list -->", renderProjects(projects))
    .replace("<!-- in-progress-list -->", renderProjects(inProgress, 3))
    .replace("<!-- in-progress-contact -->", contact);
  return <SitePage html={html} />;
}
