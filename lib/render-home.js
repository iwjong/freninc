import { existsSync } from "node:fs";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");

const featuredIds = [
  "telfair-childrens-art-museum",
  "uva-therapeutic-playroom",
  "uva-experience-design",
  "sfch-oncology",
];

const featuredLayout = [
  ["col-span-full md:col-span-5 xl:col-span-7", "large-image"],
  ["col-span-full md:col-span-3 xl:col-span-5", "small-image"],
  ["col-span-full md:col-span-3 xl:col-span-5", "small-image"],
  ["col-span-full md:col-span-5 xl:col-span-7", "large-image"],
];

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

function heroSlide(project, index) {
  const { desktop, mobile } = heroFiles(project);
  const title = escapeHtml(project.title);
  const href = `/projects#${escapeHtml(project.id)}`;
  const loading = index === 0 ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"';
  const imageStyle = index === 0
    ? "opacity:1;transition:opacity 500ms;position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;max-height:none"
    : "position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;max-height:none";
  const caption = `<span class="caption flex items-end">${title}</span>`;
  return `<li class="swiper-slide carousel radius relative w-full overflow-hidden" data-swiper-slide-index="${index}"><button aria-label="Previous slide" class="nav-button hidden xl:block prev" type="button"></button><button aria-label="Next slide" class="nav-button hidden xl:block next" type="button"></button><div class="carousel-image" style="overflow:hidden;position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;max-height:none"><picture><source media="(min-width: 640px)" srcset="${desktop}"/><img alt="${title}" decoding="async" ${loading} src="${mobile}" style="${imageStyle}"/></picture></div><div class="cpu content absolute bottom-0 flex w-full flex-col items-baseline">${caption}<a class="cta-large cta-primary filled-white hover-grey xl:hidden" href="${href}">View Projects</a></div><a class="cpu cta-large cta-primary filled-white hover-grey z-20 absolute right-0 hidden xl:block" href="${href}">View Projects</a></li>`;
}

function selectedCard(project, index) {
  const [columns, image] = featuredLayout[index];
  const title = escapeHtml(project.title);
  const href = `/projects#${escapeHtml(project.id)}`;
  return `<li class="${columns}"><a href="${href}"><div class="${image} radius-large relative overflow-hidden"><div  style="overflow:hidden;position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;max-height:none"><picture><img alt="${title}" decoding="async" loading="lazy" src="${thumbnail(project)}" style="position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;max-height:none"/></picture></div></div><h3 class="project-name body-large">${title}</h3></a></li>`;
}

export function renderHome(projects, inProgress = []) {
  const byId = new Map(projects.map((project) => [project.id, project]));
  const featured = featuredIds.map((id) => byId.get(id)).filter(Boolean);
  const selected = (featured.length ? featured : projects).slice(0, featuredLayout.length);
  const projectsCategory = cover(projects);
  return {
    hero: projects.filter(heroFiles).map(heroSlide).join(""),
    selected: selected.map(selectedCard).join(""),
    projectsCategory,
    progressCategory: cover(inProgress.filter((project) => project.media.length)) || projectsCategory,
  };
}
