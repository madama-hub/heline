# Business review required before calling the site legally complete

The browser privacy feature is implemented. The legal and privacy pages deliberately display an information-to-confirm notice and use `noindex,follow` until `src/legal-profile.mjs` is completed and `reviewed` is set to `true` following the business's review. The cookie policy describes the implemented website behavior and is available independently.

## Information still needed from Héline First

- Current share capital and commercial registration details. The official business API verified the company name, SAS classification, registered address and SIRET. The old website's legal notice uses obsolete registration details.
- Publication director's full name. The registry lists Hélène Simon Le Bihan as president; the business must confirm the publication details.
- Retention period or precise retention criteria for received enquiries, customer files and statutory archives, including when deletion takes place.
- Email provider and recipients, including any service partners receiving traveller details. Confirm the relevant processing contracts and international transfer arrangements.
- Designated consumer mediator's name, postal address and website if the business serves consumers. Do not invent a mediator or reuse another company's details.
- Current commercial terms: prices or quotation method, service confirmation, cancellation, withdrawal rules applicable to the actual service, complaints and mediation. The existing website's sales terms remain linked; the new site does not sell or confirm bookings online.
- Hosting contracts, security logs and actual retention/transfer configuration for the public Render site. Render's DPA and privacy policy describe possible mechanisms; the site owner must verify the arrangement actually used.
- Handling of optional accessibility requests and any sensitive information subsequently sent by email. The form warns against medical, passport or payment details; those must not be casually collected or retained.

Once these are confirmed, enter the relevant fields in `src/legal-profile.mjs`, update the policy wording where needed, set `reviewed:true`, rebuild and run both checks. Do not mark the pages reviewed just to remove the notice.

## Audited website behavior

- No application analytics, advertising pixels, external font requests or embedded third-party video player.
- The first-visit notice appears in the bottom-left corner on every page, including error pages.
- Choosing **Accept and remember** stores only a notice version, acknowledgement and expiry in local storage for 180 days. The record is never sent by the application to a server. Expired or invalid records are discarded on the next visit.
- **Continue without saving** closes the notice without saving a preference. It can therefore appear on later pages or visits.
- A persistent **Cookies and privacy** button reopens the notice; **Remove my saved choice** deletes the stored preference.
- No choice authorizes future analytics or advertising. Adding a tracker needs a new implementation, policy update and consent assessment.
- The form prepares an email draft locally. Its submit button is disabled until the draft handler is ready, including when JavaScript fails or is disabled. No app endpoint receives the fields. Sending is a separate action in the visitor's email app.
- Server delivery/security data are distinct from browser trackers. The public homepage audit returned no `Set-Cookie` header, but the hosting provider's operational processing still needs review.
- The footer and pre-footer content and styling have been preserved. Policy links are available from the permanent privacy button and existing legal-information page.

## Sources checked on 13 October 2026

- [Official French company API](https://recherche-entreprises.api.gouv.fr/search?q=789216934) and [business registry](https://annuaire-entreprises.data.gouv.fr/entreprise/heline-first-789216934): HELINE FIRST, SIREN 789216934, active registered establishment SIRET 78921693400032, 10 rue de Penthièvre, 75008 Paris; legal category 5710.
- [CNIL cookies guidance](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite): strictly necessary storage, genuine choices, comparable acceptance/refusal and ability to revisit a choice.
- [Service Public company website requirements](https://entreprendre.service-public.gouv.fr/vosdroits/F37351): publisher/hosting identification, privacy information, applicable commercial terms and consumer mediation.
- [CNIL information notices](https://cnil.fr/fr/passer-laction/rgpd-exemples-de-mentions-dinformation): privacy notices must be adapted to actual processing.
- [Render terms](https://render.com/terms), [privacy](https://render.com/privacy) and [DPA](https://render.com/dpa): public-site hosting identity and processing documents.

Validation: `npm run build`, `npm run check`, and `node scripts/check-privacy.mjs`, plus desktop/mobile browser checks. This technical work does not establish that the business's contracts, email operations, retention practices or other offline processes comply with all applicable law.
