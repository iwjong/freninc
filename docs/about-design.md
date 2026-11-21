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

Portraits, the hero photograph, the architectural study, the process photographs, and `FREN_Overview_v1.4.2.pdf` live in `public/assets/about/`. The hero loads eagerly; other images load lazily.

## Verification

- Production build passed.
- Geometry checked at 320, 390, 639, 640, 768, 1024, 1279, 1280, 1440, and 1920px: no page or text overflow.
- Home carousel and Projects carousel/information controls verified after the shared-code change.
- Physical devices and other browser engines were not tested. No deployment performed.

## Process and brochure update

- `public/assets/about/process/` contains the process photographs shown on the page.
- Existing process headings and descriptions appear in white directly over the images; cards reuse the same click regions, arrow cursor, touch swipes and keyboard navigation as the other About galleries.
- The final section is titled "A closer look at FREN." Its single Download brochure link uses `/assets/about/FREN_Overview_v1.4.2.pdf`. The download filename is `FREN-Overview.pdf`.

- Image cards use a dark base, photos at 55% transparency (45% opacity) and plain white text. No gradients or solid text panels.
- Values typography preserves Untitled Sans: section title 32-48px, value names 24-32px, supporting labels 16-18px and body 16px. The redundant View PDF action is removed.
