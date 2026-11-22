# FREN color review and implementation

Reviewed November 21, 2026 with better-colors and better-accessibility.

The supplied brochure establishes charcoal, pale yellow, warm taupe and white. The website uses the same family with role-based tokens in `app/globals.css`: change a token to update shared components rather than introducing page-specific colors.

| Role | Token | Value |
| --- | --- | --- |
| Page background | `--color-background` | `#1D1D1D` |
| Dark cards and fields | `--color-surface` | `#292623` |
| Main text / light panels | `--color-text`, `--color-paper` | `#F4F1E9` |
| Secondary text | `--color-text-secondary` | `#D8D0C7` |
| Button hover or press / selected control | `--color-accent` | `#FFF6A8` |
| Primary hover | `--color-accent-hover` | `#F3DF82` |
| Footer | `--color-footer` | `#C6B9AA` |
| Original taupe / decorative edge | `--color-taupe` | `#887B6F` |
| Ink on light surfaces | `--color-ink` | `#0C0C0C` |
| Control boundaries | `--color-border` | `#93877B` |

Buttons are neutral at rest (gray on dark surfaces, charcoal on the light brochure panel), and turn pale yellow on hover or press. Selected options and open biography toggles also use yellow. Keyboard focus retains a visible outline. Errors retain a distinct warm red and explicit messages. Photography and the white circular gallery cursor retain their original colors.

## Findings resolved

Before values below describe either the initial proposal or the existing component, as identified.

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `app/globals.css:20`, `app/about/about.css:8`, `app/home.css`, `app/contact/contact.css` | Independent neutral-gray values | Shared warm semantic tokens | Prevents different pages from drifting into different color families. |
| HIGH | `app/globals.css:2877` | Proposed white text on original taupe `#887B6F` | Ink `#0C0C0C` on lighter derived taupe `#C6B9AA` | White on original taupe gives only 4.11:1; final footer gives 10.17:1. |
| MEDIUM | `app/globals.css:20` | Proposed muted text `#BDB5AB` | `#D8D0C7` | Improves small secondary-copy readability: 11.05:1 on page background and 9.86:1 on cards. |
| HIGH | `app/about/about.css:55` | White caption on bright architectural photograph | Ink caption | Caption was visually lost against the current image; final saved screenshot inspected. Recheck when replacing the photograph. |

Also removed absolute positioning from the footer copyright so it occupies its own grid row on mobile instead of overlapping navigation.

## Verification and verdict

- `node .hallmark/color-review.mjs`: 13 opaque color-pair assertions passed. Body contrast 14.94:1; primary button 17.70:1; control boundary on card 4.29:1. APCA is used as supplemental readability guidance, not a WCAG conformance score.
- `.hallmark/color-render-results.json`: Home, About, Projects, Contact, Foundation, Privacy Policy and Terms of Service checked at 390px and 1440px. All 14 checks showed consistent shared backgrounds and no horizontal overflow.
- Saved screenshots in `.hallmark/color-review/` inspected for home purpose cards, About cards and brochure, Contact, legal layout and mobile footer. Mobile footer copyright is below navigation with no horizontal overflow.
- Contact selected-option keyboard change and empty-form errors checked without submitting an inquiry. Error text and borders use the error token.
- `npm run build`: passed after final changes.
- All tokens are sRGB hex, with no wide-gamut rendering dependency.
- Dark pages and light cards/footer reviewed. No separate OS light-mode theme was introduced.

Verdict: **Approve for the reviewed palette and solid-color UI combinations.** No actionable color findings remain in that scope. This is not a whole-site accessibility certification. Safari, physical mobile devices and contrast across every photographic background were not tested. The browser automation did not reliably enter keyboard `:focus-visible` modality, so actual focus-indicator painting remains a manual verification item; the light/dark focus tokens themselves were contrast-checked.

Contrast references: [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [APCA source](https://github.com/Myndex/apca-w3).
