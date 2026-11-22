# Projects typography and layout review

Reviewed November 21, 2026 using Better Typography and Better Layout. Scope: align Projects with the approved Home and About design language.

## Applied hierarchy

| Role | Size | Line height | Treatment |
| --- | --- | --- | --- |
| Page title | 44–80px | 1.02 | Same display scale as About; left aligned |
| Section heading | 32–48px | 1.08 | Shared `--fren-heading` |
| Project title | 24–32px | 1.15 | Shared `--fren-title`; semantic h2, h3 within In Progress |
| Introduction / overview | 16–18px | 1.55 | Shared `--fren-body`; maximum 60ch |
| Project theme / fact value | 16px | 1.5–1.55 | Secondary information below the project title |
| Fact label | 14px | 1.77 | Consistent label column |
| Button | 14–18px | 1.4 | Existing pill shape; minimum 44px height |

Desktop uses the About-style two-column alignment for the introduction, expanded facts/description, In Progress heading and closing inquiry. Below 768px these become one column; project controls follow their title in normal flow. Project spacing follows the 80–160px section rhythm. Existing page gutters, photo proportions, corner radii, image navigation, colors and neutral-to-yellow button behavior remain in use.

## Findings resolved

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `content/projects.html:1`, `app/projects/projects.css:19` | Centered introduction nearly the same size as the page title, extensive top padding | 44–80px title with 16–18px introduction in aligned columns | Establishes title/body hierarchy and brings actual work into the first viewport. |
| MEDIUM | `lib/render-projects.js:100`, `app/projects/projects.css:39` | Project names rendered as paragraphs around 20px on desktop | Semantic headings at the shared 24–32px title scale | Makes projects scannable and aligns card-title proportions with Home/About. |
| MEDIUM | `lib/render-projects.js:107`, `app/projects/projects.css:59` | Overview used large text with a tight 1.2 line height; DOM order differed from visual fact/description order | Facts precede overview in both reading and visual order; overview uses body scale and 1.55 line height | Improves paragraph comfort and predictable reading order on mobile. |
| MEDIUM | `content/projects.html:20`, `app/projects/projects.css:79` | In Progress and the inquiry used unrelated legacy heading/body treatments | Shared section-heading scale, separate supporting paragraph and aligned action | Gives secondary sections the same hierarchy as About. |
| LOW | `app/projects/projects.css:89` | Information button and long project title competed horizontally on narrow screens | Button follows the title below 768px | Keeps titles readable and controls reachable without squeezed columns. |

## Verification and verdict

- Inspected desktop introduction, expanded information, In Progress, closing inquiry and mobile layouts in Orca's browser.
- Checked widths 320, 390, 768, 1440 and 1920px. No horizontal page overflow or clipped title/overview/fact containers. Results: `.hallmark/projects-review/layout-checks.json`.
- Exactly one h1 and ten project headings. Body text remains at least 16px, project titles at least 24px. Browser font loading reported complete; font files and family were unchanged.
- Activated all ten disclosure buttons through DOM click events: all panels opened and all `aria-expanded` values became true. Verified first panel closes and reaches zero height. Activated the first gallery's existing next-button handler: real slide index changed from 0 to 1.
- Orca's pointer-click command did not reliably activate the disclosure in this run, although DOM activation did. Native pointer/touch and keyboard end-to-end verification remains outstanding; no interaction code was changed.
- `npm run build` passed. No new dependencies or persistent test suite added for the style change.
- Native browser 200% text zoom, Safari and physical mobile devices were not tested.

**Verdict: Approve for the reviewed typography and responsive layout scope.** No actionable visual findings remain in the checked viewports. Interaction and device limitations above are not a claim of a complete accessibility audit.
