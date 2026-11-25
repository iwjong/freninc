import { existsSync } from "node:fs";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");

const heroCaptions = {
  "telfair-childrens-art-museum": "We designed interactive exhibits for a children’s art museum.",
  "telfair-impressionism": "We make art approachable for children and families.",
  "uva-experience-design": "We use storytelling to bring calm to children in care.",
  "uva-wayfinding": "We help patients and families find their way through hospitals.",
  "hca-healing-garden": "We design places for rest and play, indoors and out.",
  "sfch-picu-pacu-family": "We make room for gentle play in intensive and post-surgical care.",
  "uva-therapeutic-playroom": "We turn movement into play for children in recovery.",
};

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function folderOf(project) {
  const item = project.media[0];
  const src = typeof item === "string" ? item : item.src;
  return src.split("/")[3];
}

function asset(folder, name) {
  return `/assets/projects/${folder}/${name}`;
}

function existing(urlPath) {
  return existsSync(path.join(publicDir, urlPath.slice(1))) ? urlPath : null;
}

function thumbnail(project) {
  const folder = folderOf(project);
  return existing(asset(folder, "thumbnail.jpg"))
    || existing(asset(folder, "thumbnail.webp"))
    || (typeof project.media[0] === "string" ? project.media[0] : project.media[0].src);
}

function heroFiles(project) {
  const folder = folderOf(project);
  const desktop = existing(asset(folder, "hero-desktop.jpg"));
  const mobile = existing(asset(folder, "hero-mobile.jpg"));
  return desktop && mobile ? { desktop, mobile } : null;
}

function categoryFiles(projects) {
  return projects.flatMap((project) => {
    const file = existing(asset(folderOf(project), "category.jpg"));
    return file ? [file] : [];
  });
}

function cover(projects) {
  if (!projects.length) return "";
  return categoryFiles(projects)[0] ?? thumbnail(projects[0]);
}

function heroSlide({ project, caption, files: { desktop, mobile } }, index) {
  const href = `/projects#${escapeHtml(project.id)}`;
  const loading = index === 0 ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"';
  return `<li class="swiper-slide carousel radius relative w-full overflow-hidden" data-swiper-slide-index="${index}">
    <button aria-label="Previous slide" class="nav-button hidden xl:block prev" type="button"></button>
    <button aria-label="Next slide" class="nav-button hidden xl:block next" type="button"></button>
    <div class="carousel-image">
      <picture><source media="(min-width: 640px)" srcset="${desktop}"/><img alt="" decoding="async" ${loading} src="${mobile}"/></picture>
    </div>
    <div class="cpu content absolute bottom-0 flex w-full flex-col items-baseline">
      <span class="caption flex items-end">${escapeHtml(caption)}</span>
      <a class="cta-large cta-primary filled-white hover-grey xl:hidden" href="${href}">View Projects</a>
    </div>
    <a class="cpu cta-large cta-primary filled-white hover-grey z-20 absolute right-0 hidden xl:block" href="${href}">View Projects</a>
  </li>`;
}

export function renderHome(projects, inProgress = []) {
  const slides = projects.flatMap((project) => {
    const caption = heroCaptions[project.id];
    const files = caption && heroFiles(project);
    return files ? [{ project, caption, files }] : [];
  });
  const projectsCategory = cover(projects);
  return {
    hero: slides.map(heroSlide).join(""),
    projectsCategory,
    progressCategory: cover(inProgress.filter((project) => project.media.length)) || projectsCategory,
  };
}
