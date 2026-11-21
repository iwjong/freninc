import { readFileSync } from "node:fs";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function imageSize(file) {
  const data = readFileSync(file);
  if (data[0] === 0xff && data[1] === 0xd8) {
    let offset = 2;
    while (offset + 8 < data.length) {
      if (data[offset] !== 0xff) break;
      const marker = data[offset + 1];
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2;
        continue;
      }
      const size = data.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc2) return { width: data.readUInt16BE(offset + 7), height: data.readUInt16BE(offset + 5) };
      offset += 2 + size;
    }
  }
  if (data.toString("ascii", 1, 4) === "PNG") return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  if (data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP") {
    const format = data.toString("ascii", 12, 16);
    if (format === "VP8X") return { width: 1 + data.readUIntLE(24, 3), height: 1 + data.readUIntLE(27, 3) };
    if (format === "VP8 ") return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
  }
  let search = 0;
  while (search < data.length) {
    const type = data.indexOf("tkhd", search);
    if (type === -1) break;
    const version = data[type + 4];
    const widthOffset = type + (version === 1 ? 92 : 80);
    const width = data.readUInt16BE(widthOffset);
    const height = data.readUInt16BE(widthOffset + 4);
    if (width && height) return { width, height };
    search = type + 4;
  }
  return null;
}

function mediaSize(src) {
  try {
    return imageSize(path.join(publicDir, src.replace(/^\//, ""))) ?? { width: 3, height: 2 };
  } catch {
    return { width: 3, height: 2 };
  }
}

function mediaStyle(src) {
  const { width, height } = mediaSize(src);
  const mob = (width / height) * 200;
  const format = (value) => String(Math.round(value * 1e5) / 1e5);
  return `--media-width-mob:${format(mob)};--media-width-tab:${format(mob * 2)};--media-width-des:${format(mob * 3.4)}`;
}

function mediaSource(item) {
  return typeof item === "string" ? item : item.src;
}

function slide(project, item, index, eager) {
  const src = mediaSource(item);
  const style = typeof item === "string" ? mediaStyle(src) : mediaStyleFromSize(item.width, item.height);
  const label = project.theme ? `${project.title}, ${project.theme}` : project.title;
  const alt = project.note ? "Temporary visual reference; not a photograph of this FREN project." : `${label} — image ${index + 1}`;
  if (src.endsWith(".mp4")) {
    return `<li class="swiper-slide radius relative w-auto overflow-hidden" data-swiper-slide-index="${index}"><video class="media-video" loop muted playsinline preload="none" src="${escapeHtml(src)}" style="${style}" type="video/mp4">Your browser does not support the video tag.</video></li>`;
  }
  const loading = eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"';
  return `<li class="swiper-slide radius relative w-auto overflow-hidden" data-swiper-slide-index="${index}"><div class="media-image relative" style="${style}"><div style="overflow:hidden;position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;max-height:none"><picture><img alt="${escapeHtml(alt)}" decoding="async" ${loading} src="${escapeHtml(src)}" style="position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;max-height:none"/></picture></div></div></li>`;
}

function mediaStyleFromSize(width, height) {
  const mob = (width / height) * 200;
  const format = (value) => String(Math.round(value * 1e5) / 1e5);
  return `--media-width-mob:${format(mob)};--media-width-tab:${format(mob * 2)};--media-width-des:${format(mob * 3.4)}`;
}

function fact(label, value) {
  return `<p class="fact-row"><span class="fact-label">${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></p>`;
}

function renderProject(project, index) {
  const theme = project.theme ? `<p class="project-theme body-small text-grey-100">${escapeHtml(project.theme)}</p>` : "";
  const note = project.note ? `<p class="body-small media-note">${escapeHtml(project.note)}</p>` : "";
  const facts = [
    fact("Client", project.client),
    fact("Service", project.service),
    project.year ? fact("Year", project.year) : "",
  ].join("");
  const slides = project.media.map((item, slideIndex) => slide(project, item, slideIndex, index === 0 && slideIndex === 0)).join("");
  return `<li class="project-item overflow-hidden" id="${escapeHtml(project.id)}">
    <div class="container">
     <div class="project-heading flex justify-between">
      <div class="project-title">
       <p class="body-large"><span class="brand">${escapeHtml(project.title)}</span></p>
       ${theme}
      </div>
      <button aria-controls="details-${escapeHtml(project.id)}" aria-expanded="false" class="cta-small body">Information</button>
     </div>
     ${note}
     <div class="reference-details" hidden id="details-${escapeHtml(project.id)}">
      <div class="project-details site-grid grid-flow-row-dense">
       <div class="wysiwyg body-large project-description col-span-full sm:col-span-4 sm:col-start-5 xl:col-span-4 xl:col-start-7 wysiwyg-content_wysiwyg__jUgBL"><p>${escapeHtml(project.summary)}</p></div>
       <div class="listed-details body col-span-full sm:col-span-4 sm:col-start-1">${facts}</div>
      </div>
     </div>
    </div>
    <div class="project-images"><div class="swiper container"><ul class="swiper-wrapper">${slides}</ul><button aria-label="Previous slide" class="nav-button hidden xl:block prev" type="button"></button><button aria-label="Next slide" class="nav-button hidden xl:block next" type="button"></button></div></div>
   </li>`;
}

export function renderProjects(projects) {
  return projects.map(renderProject).join("");
}
