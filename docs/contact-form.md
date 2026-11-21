# Contact page and inquiry delivery

The Contact page reuses FREN's dark background, UntitledSans typography, page gutters, rounded fields and pill buttons. The desktop introduction stays beside the form; smaller screens stack the sections. Shared header and footer remain unchanged.

## Inquiry types

- New project: interests, timing, budget and project description.
- Consulting: interests, timing, budget and the challenge needing guidance.
- Collaboration: discipline, portfolio link and partnership proposal.
- Something else: a general message.

Name, email, message and privacy acknowledgement are required. Conditional fields are excluded when irrelevant. Validation runs in the browser and again on the server. Failed requests preserve answers; pending requests disable duplicate submission; retries retain their submission ID.

## Current local mode

Run `npm run dev` and open http://127.0.0.1:3000/contact.

Without email credentials, development saves one JSON file per inquiry in `.data/inquiries/`. The page and receipt explicitly say that no email was sent. These private files are outside `public/` and excluded from Git. They contain personal information: keep access limited and remove test records when no longer needed. The optional `CONTACT_LOCAL_DIR` changes the directory.

Production does not fall back to local storage: without complete mail settings, the endpoint returns 503 and displays the studio email address.

## Enable email delivery

Copy `.env.example` to `.env.local`, then set all three values:

```dotenv
RESEND_API_KEY=your-secret-key
CONTACT_FROM=FREN <website@your-verified-domain>
CONTACT_TO=support@freninc.com
```

The user confirmed `support@freninc.com` as the inquiry inbox and has no existing delivery service. The implementation is ready to connect to Resend; an account, API key and verified sender are still required. Use a sender domain verified in Resend. Restart the local server after changing settings; set the same private variables in the hosting environment for deployment. Never use a `NEXT_PUBLIC_` prefix for these values.

The server posts plain text to Resend with a fixed recipient, the visitor's email as Reply-To, and an idempotency key. Provider acceptance is required before reporting success. Acceptance does not prove inbox delivery; complete an authorized live delivery check after setup, including spam-folder review.

Provider references: [Resend API schema](https://github.com/resend/resend-openapi/blob/main/resend.yaml), [sending-domain documentation](https://resend.com/docs/dashboard/domains/introduction).

## Verification and limits

- `npm run build`: production compilation.
- Browser checks: four local submission types, conditional fields, required fields, duplicate clicks, failure preservation, responsive layouts. Synthetic local records are marked with a browser verification message.
- Live mailbox delivery is not tested; no credentials were available. Safari and physical mobile devices were not tested.
- The email-based throttle is per server process. Before a public production launch, configure hosting-level abuse controls; use a shared rate limiter when running multiple instances. Check same-origin submission through the final hosting proxy and HTTPS domain.
- No attachments, CRM integration or automatic visitor reply was added. Newsletter functionality is outside this Contact change.

Implementation: `content/contact.html`, `app/contact/contact.css`, `components/contact-form.js`, `app/api/inquiries/route.js`, `lib/inquiries.mjs`.
