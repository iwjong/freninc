import { siteUrl } from "../lib/site";

export const dynamic = "force-static";

export default function sitemap() {
  return ["/", "/about", "/projects", "/contact"].map((path) => ({
    url: new URL(path, siteUrl).href,
  }));
}
