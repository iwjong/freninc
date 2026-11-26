import SitePage from "../components/site-page";
import { inProgress, projects } from "../content/projects";
import { studioEmail } from "../lib/inquiry";
import { readPage } from "../lib/read-page";
import { renderHome } from "../lib/render-home";
import { siteDescription, siteName, siteUrl } from "../lib/site";
import "./home.css";

export const metadata = {
  title: `${siteName} | Experience Design Agency`,
  alternates: { canonical: "/" },
};

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: siteName,
      alternateName: "FREN",
      url: siteUrl,
      description: siteDescription,
      email: studioEmail,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Richmond Hill",
        addressRegion: "GA",
        addressCountry: "US",
      },
    },
    {
      "@type": "WebSite",
      name: siteName,
      alternateName: "FREN",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}#organization` },
    },
  ],
};

export default async function Page() {
  const home = renderHome(projects, inProgress);
  const html = (await readPage("home"))
    .replace("<!-- home-hero -->", home.hero)
    .replace("<!-- home-category-projects -->", home.projectsCategory)
    .replace("<!-- home-category-progress -->", home.progressCategory);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c") }}
      />
      <SitePage html={html} />
    </>
  );
}
