# FREN Inc.

**Spaces for care, learning and play.**

FREN is an experience design studio based in Richmond Hill, Georgia. We bring physical spaces, original artwork and interactive technology together for the places where children and families learn, play and heal.

This repository contains the FREN company website: a portfolio of selected projects, an introduction to our team and process, and a place to start a conversation with the studio.

[Website](https://freninc.com) · [Contact the studio](mailto:support@freninc.com)

## The website

| Page | Route | Content |
| --- | --- | --- |
| Home | `/` | Featured work, our purpose and selected projects |
| About | `/about` | Team, capabilities, working principles and downloadable studio brochure |
| Projects | `/projects` | Image galleries, project overviews and work in progress |
| Contact | `/contact` | Project inquiries, consulting requests and collaboration proposals |
| Privacy Policy | `/privacy-policy` | Information about personal data and privacy |
| Terms of Service | `/terms-of-service` | Terms for using the website |

The interface uses shared typography, rounded media frames, horizontal galleries and a warm neutral palette. Buttons use yellow on hover or press. Desktop and mobile layouts share the same visual hierarchy.

## Built with

- Next.js App Router and React
- JavaScript and TypeScript
- Shared and page-specific CSS
- Swiper for image galleries
- Locally stored images, video, animations and fonts
- A server-side inquiry endpoint with optional Resend email delivery

See [package.json](package.json) for the installed versions and available commands.

## Run locally

Requirements: **Node.js 20.9 or newer** and npm. Use a supported Node.js LTS release that meets this minimum.

From the repository root:

```bash
npm ci
npm run dev
```

Open **http://127.0.0.1:3000**.

To build and preview the production application locally:

```bash
npm run build
npm run start
```

Both development and production preview scripts bind to `127.0.0.1:3000`. Stop the development server before starting the production preview on the same port. The inquiry API requires a server runtime; a static-only export does not provide email delivery.

## Project structure

```text
app/                    Routes, metadata and styles
  globals.css           Shared colors, typography, layout and controls
  home.css              Home page styles
  about/                About page and styles
  projects/             Projects page and styles
  contact/              Contact page and styles
  api/inquiries/        Inquiry submission endpoint
components/             Shared interactions, carousels and form behavior
content/                Editable page HTML and project data
lib/                    Page composition, project rendering and inquiry delivery
public/assets/          Brand assets, project media and studio materials
docs/                   Design decisions and implementation notes
```

## Update content and design

| What to change | Where to edit |
| --- | --- |
| Project names, descriptions, clients and gallery media | [content/projects.ts](content/projects.ts) |
| Page copy and structure | HTML files in [content/](content/) |
| Shared navigation and footer | [content/header.html](content/header.html), [content/footer.html](content/footer.html) |
| Global color and type tokens | [app/globals.css](app/globals.css) |
| Page-specific layouts | `app/home.css`, `app/about/about.css`, `app/projects/projects.css`, `app/contact/contact.css` |
| Gallery and disclosure behavior | [components/site-page.jsx](components/site-page.jsx) |
| Images, fonts and brochure | [public/assets/](public/assets/) |

Keep shared spacing, typography and button states consistent when adding content. After changes, run `npm run build` and check the affected pages at desktop and mobile widths, including gallery navigation and expanded project information.

## Inquiry delivery

The studio inbox is **support@freninc.com**.

Without mail credentials, development mode saves inquiries as private JSON files in `.data/inquiries/`. It does **not** send email. The `.data/` directory is excluded from Git.

To enable email delivery, copy [.env.example](.env.example) to `.env.local` and configure:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Server-side Resend API key |
| `CONTACT_FROM` | Sender address on a domain verified with Resend |
| `CONTACT_TO` | Recipient address, normally `support@freninc.com` |
| `CONTACT_LOCAL_DIR` | Optional development-only local inbox directory |

Restart the development server after changing environment variables. For deployment, set the email variables in the hosting environment. Keep credentials server-side and out of Git.

Production does not fall back to local storage: incomplete mail settings make submission unavailable. See [Contact form documentation](docs/contact-form.md) for validation, delivery behavior and setup checks.

## Current configuration

- Search indexing is disabled through the root metadata in [app/layout.jsx](app/layout.jsx). Review this setting before a public launch.
- Foundation navigation labels are present but their links are disabled. The local `/foundation` route remains in the source.
- Newsletter forms are not connected to a mailing-list provider.
- Live inquiry delivery requires mail credentials and a verified sender; confirm delivery after configuration.

## Design and implementation notes

- [Color system](docs/color-system.md)
- [About page design](docs/about-design.md)
- [Projects typography and layout](docs/projects-design-review.md)
- [Contact form](docs/contact-form.md)
- [Legal page review](docs/legal-review.md)

For project inquiries, consulting or collaboration, contact [support@freninc.com](mailto:support@freninc.com).
