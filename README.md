# Mello — Email Capture Page

Branded landing page for the **Weekend-Ship Playbook** lead magnet, built on the `mello-brand-system-v5` design system (Anton/Bebas/DM Serif/Inter/IBM Plex Mono · warm-noir · red #C42B2B).

## Files
- `index.html` — the page (self-contained: fonts from Google, everything else inline).
- `api/subscribe.js` — Vercel serverless function that adds the email to beehiiv (keeps your API key server-side).

## Deploy (Vercel — matches your stack)
1. Drop this folder into a new Vercel project (or `vercel` from the CLI).
2. Add two Environment Variables in Vercel → Settings:
   - `BEEHIIV_API_KEY` — your beehiiv API key
   - `BEEHIIV_PUBLICATION_ID` — the publication id (looks like `pub_xxxx`)
3. In beehiiv, set the **welcome email / automation** to deliver the Playbook PDF — the function sends `send_welcome_email: true`, so beehiiv handles delivery.
4. Point your bio link (threads.com/@romellotcp) at the deployed URL.

## Test / demo mode
Open `index.html` directly (no server) and the form runs in **demo mode** — it shows the success state without sending, so you can see the flow. Real capture only happens once deployed with the env vars set.

## To switch providers (ConvertKit/Kit, MailerLite, etc.)
Change `SUBSCRIBE_ENDPOINT` at the bottom of `index.html`, or edit `api/subscribe.js` to call the other provider's API. The front-end just POSTs `{ email }` as JSON.

## Notes
- Fully responsive (stacks on mobile), light/dark toggle in the nav.
- Respects `prefers-reduced-motion`.
- Custom cursor and grain match the brand system; both disable on touch devices.
