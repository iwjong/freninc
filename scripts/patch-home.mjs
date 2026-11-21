import { readFileSync, writeFileSync } from "node:fs";

const file = "content/home.html";
let html = readFileSync(file, "utf8");

html = html.replace(
  /<ul class="swiper-wrapper">[\s\S]*?<\/ul>/,
  '<ul class="swiper-wrapper">\n     <!-- home-hero -->\n    </ul>',
);

html = html.replace(
  /  <p class="container body-small media-note">\r?\n   Images on this page are temporary visual references\. FREN project photography will be added\.\r?\n  <\/p>\r?\n/,
  "",
);

html = html.replace(
  'src="/assets/projects/eurovision-2024/category.jpg"',
  'src="<!-- home-category-projects -->"',
);

html = html.replace(
  'src="/assets/projects/nike-air-max-kids/category.jpg"',
  'src="<!-- home-category-progress -->"',
);

html = html.replace(
  /<ul class="jsx-1321389989 site-grid grid">[\s\S]*?<\/ul>/,
  '<ul class="jsx-1321389989 site-grid grid">\n   <!-- home-selected -->\n  </ul>',
);

writeFileSync(file, html);
