# Héline First

A dependency-free, bilingual website built around the supplied `video 1.mp4`. Source content is in `src/content.mjs`, page templates in `src/views.mjs`, styling in `src/styles.css`, and interactions in `src/app.js`.

## Local use

Run `npm run build`, then `npm start`. Open http://127.0.0.1:4173. `npm run check` verifies page coverage, internal links, metadata and video integrity. No dependency installation is required.

## Scope retained

Airport welcome (arrival, departure and connections), event hosts, additional services, tailored hospitality stays, event organisation, reservation, contact, legal information and links to the existing sales terms. Dedicated Paris CDG and Nice pages and full English equivalents are included. Eight historical French URLs remain available with canonical links to the new pages.

## Enquiries

The reservation form validates inputs and prepares an email draft for review. Visitors can open their mail application or copy the draft. The website does not send email itself, store requests, charge customers, or confirm bookings. Direct server-side email delivery would require a separately configured provider and credentials.

## Content and assets

Service information and public business contacts are adapted from https://fr.helinefirst.com/ and its service pages. No reviews, partner logos, staff portraits or service statistics have been invented. Source pages: accueil-aéroportuaire.html, les-hôtesses-évènementielles.html, les-services.html, le-réceptif-un-service-sur-mesure.html, organisation-évènementielle.html, réservation.html, contact.html and mentions-légales.html.

Illustrative photography from Unsplash (these are not photographs of Héline's staff or its past events):

- Paris — Fabien Maurin: https://unsplash.com/photos/x-S6ZlJ6dP0
- Nice — 35MM North: https://unsplash.com/photos/_k0FKWat-n4
- Reception — Filip Rankovic Grobgaard: https://unsplash.com/photos/YYD8eqHwlFw

Fonts are self-hosted Google Fonts: Cormorant Garamond and DM Sans, with their OFL license files included. The GitHub project includes the supplied video in `media/video-original.mp4`; the local Sites checkout also supports the original file in its parent folder. The website uses a smaller 1600×900 H.264 copy with fast-start metadata. A screenshot from the supplied video provides the fast-loading poster. Reduced-motion and data-saving preferences keep the still image until the visitor chooses playback. `video-provenance.json` records checksums of the original and web copy.

The interface uses text-only navigation and controls. Decorative arrows, icons, separators and section numbers have been removed. The desktop homepage video fills the viewport; a text playback control remains available.

To re-encode the original video, install `imageio-ffmpeg` into the checkout-local `.tools` directory and run `python scripts/optimize-video.py`. The downloaded encoder runtime is excluded from Git.

## Before a public domain migration

Review copy and current service availability with the business. The original contact and legal pages list different addresses; company legal details should be reconciled before replacing the existing public legal notice. Sales terms link to the business's existing document. The current site domain has not been modified.

Set `SITE_ORIGIN` to the approved public origin and rebuild when connecting a production domain. Preserve the old site's URL map and configure HTTP redirects on its host. This new Site starts owner-private; search metadata is prepared, but search indexing requires a public release.
