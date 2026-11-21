# Legal pages: implementation notes

Prepared November 21, 2026. These are general design-agency policy drafts saved locally at the user's request. They are not a substitute for legal advice or a project services agreement.

## Local drafts

- Privacy Policy: `content/privacy-policy.html`, served at `/privacy-policy`.
- Terms of Service: `content/terms-of-service.html`, served at `/terms-of-service`.
- The text describes a general agency relationship, not the development preview's form behavior or exact tracking setup.
- No production deployment was performed. General policy commitments must be reconciled with actual business practices before publication.

## Verified basis

- Company name, address and email match the public [FREN About page](https://www.freninc.com/about).
- The supplied existing policy URLs could not be retrieved. This text is newly drafted, not a transcription of those pages.
- The local website has no analytics or advertising integration. Assets and animations are served locally.
- `components/site-page.jsx` prevents form submission. Inquiry and newsletter forms display preview messages and do not send information.
- The privacy notice stores a dismissal preference in local storage. It is not a tracking consent mechanism.
- Footer, privacy notice and policy cross-links point to the new local routes.

## Before public launch

- Confirm the legal entity, contact details, actual hosting/email providers and any server logs or retention settings.
- Confirm actual inquiry handling, collaborator access, retention, security measures and international processing against the proposed wording.
- Review which privacy laws apply to the company's actual activities and audiences. The rights section is conditional, not a claim of compliance in every jurisdiction.
- Confirm that the general privacy description matches actual forms, newsletters, analytics, embedded services and any required cookie choices. Name providers and specify retention periods where applicable law requires them.
- Confirm the proposed commitments on data sales, deletion, access restrictions and provider obligations before adopting the policy.
- Have qualified counsel review the policies, especially the website warranty/liability provisions and required jurisdiction-specific disclosures.
- Keep scope, fees, revisions, payment, ownership, confidentiality, cancellation and project liability in signed project agreements.

## Research references

- [FTC: Privacy and Security](https://www.ftc.gov/business-guidance/privacy-security): privacy statements must match actual practices.
- [FTC: Protecting Personal Information](https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business-0): data minimization, retention and security considerations.
- [FTC: COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions): children's services need separate audience and collection analysis. A portfolio's healthcare or museum work does not establish that all client experiences share its data practices.
