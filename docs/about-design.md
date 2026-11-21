# About page design

## Scope and authority

The About page uses the existing Home and Projects visual language. The user requested a stronger typographic hierarchy and an image-led composition instead of repeated prose sections.

- Keep the shared Untitled Sans regular face, foreground, dark canvas, `.container` gutters, `.radius` media corners, and pill controls.
- Page content: `content/about.html`; scoped styling: `app/about/about.css`, imported by `app/about/page.jsx`.
- `components/site-page.jsx` reuses the existing lazy-loaded Swiper for the team, What we do and process galleries. These galleries do not loop or autoplay. Home and Projects retain their existing settings.
- About galleries use left/right click regions like Projects, with no separate arrow buttons. Interactive biographies are excluded from gallery clicks; touch swipes and keyboard arrows remain available. The shared opaque white cursor uses `public/assets/brand/gallery-arrow.svg` supplied by the user.
- Service cards place dark capability pills above the description, with generous space between them.
- Native `details` elements keep biographies keyboard accessible. Each position title is the disclosure button below its name; there is no separate Biography label or plus icon. Service descriptions are always visible inside text cards; all galleries remain horizontally scrollable without JavaScript.
- No new dependencies, analytics, fabricated claims, or production deployment.

## Composition and type

Intro statement and real work photograph; team portrait gallery; one representative image followed by four text capability cards; a split values section; five sequential process photo cards; a brochure preview and download section. The original section IDs and action destinations remain.

| Role | Mobile | Large desktop |
| --- | --- | --- |
| Main statement | 44px | 80px maximum |
| Section heading | 32px | 48px maximum |
| Person/service title | 24px | 32px maximum |
| Body | 16px minimum | 18px maximum |
| Caption and role | 14px | 14px |

Team cards show four people at desktop width, then become a navigable horizontal gallery with a visible next card on smaller screens. Services stay in a horizontal gallery: a wider image cover and text cards at desktop widths, then one card with a next-card preview on mobile. Values use a left-hand section heading and four ruled rows on the right, then stack on tablet and mobile; the brochure becomes a single-column layout, while process cards retain horizontal scrolling with a next-card preview. Existing site gutter breakpoints at 640 and 1280px remain authoritative.

## Assets

The four original portraits and factual content come from `public/assets/about/` and `FREN_Overview_v1.4.2.pdf`. Optimized WebP derivatives in `public/assets/about/work/` use the site's actual project images:

- `studio.webp`: `tcam-maritime/gallery-1.jpg`
- `environment.webp`: `hca-healing-garden/gallery-1.jpg`
- `digital.webp`: `tcam-maritime/gallery-2.jpg`
- `art.webp`: `uva-bmt-er/gallery-1.jpg`
- `strategy.webp`: `uva-wayfinding/gallery-1.jpg`

Original files are retained. What we do uses only `environment.webp`; the other three service derivatives remain available but are no longer loaded by About. The hero loads eagerly; other images load lazily.

## Verification

- Production build passed.
- Geometry checked at 320, 390, 639, 640, 768, 1024, 1279, 1280, 1440, and 1920px: no page or text overflow.
- Initial redesign: team previous/next controls, eight disclosures, and keyboard Enter verified. Service disclosures were subsequently replaced by always-visible text cards; the former button-navigation results are recorded in `.hallmark/what-we-do-checks.json`. Current click-region assertions are in `.hallmark/gallery-interaction-check.js` and results in `.hallmark/gallery-interaction-results.json`.
- Home carousel and Projects carousel/information controls verified after the shared-code change.
- Independent visual review passed after correcting the mobile hero crop.
- Impeccable detector returned no findings. Hallmark's static checks were used; its browser renderer was unavailable because puppeteer-core is not installed. Orca viewport captures supplied the visual checks; its full-page capture timed out.
- Physical devices and other browser engines were not tested. No deployment performed.

Evidence: `.hallmark/about-verification.json` and `.hallmark/about-responsive-checks.json`. These are local verification artifacts, not website content.

## Process and brochure update

- `public/assets/about/process/` contains five optimized images extracted directly from the supplied PDF, plus a rendered preview of PDF page 15. Source page/image references are recorded in `.hallmark/process-assets.json`. No PDF changes.
- Existing process headings and descriptions appear in white directly over the images; cards reuse the same click regions, arrow cursor, touch swipes and keyboard navigation as the other About galleries.
- The final section is titled "A closer look at FREN." Its single Download brochure link uses `/assets/about/FREN_Overview_v1.4.2.pdf` (47 PDF pages, 13.1 MB). The download filename is `FREN-Overview.pdf`.
- Browser assertions: `.hallmark/process-interaction-check.js`; responsive results: `.hallmark/process-interaction-results.json`.

- Image cards use a dark base, photos at 55% transparency (45% opacity) and plain white text. No gradients or solid text panels.
- Values typography preserves Untitled Sans: section title 32-48px, value names 24-32px, supporting labels 16-18px and body 16px. The redundant View PDF action is removed.
