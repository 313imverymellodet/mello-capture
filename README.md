# Mello — Email Capture Page

Branded landing page for the **Weekend-Ship Playbook** lead magnet, built on the `mello-brand-system-v5` design system (Anton/Bebas/DM Serif/Inter/IBM Plex Mono · warm-noir · red #C42B2B).

## Files
- `index.html` — the page (self-contained: fonts from Google, everything else inline).
- `api/subscribe.js` — Vercel serverless function that (1) adds the email to a **Resend Audience** and (2) sends the branded welcome email with the Playbook link. Keeps your API key server-side.

## Deploy (Vercel — matches your stack)
1. Drop this folder into a new Vercel project (or `vercel` from the CLI).
2. Add these Environment Variables in Vercel → Settings:
   - `RESEND_API_KEY` — your Resend API key (`re_...`)
   - `RESEND_AUDIENCE_ID` — the audience/list id (Resend → Audiences)
   - `RESEND_FROM` — e.g. `Mello <mello@learnwithmello.com>` (domain must be verified in Resend)
   - `PLAYBOOK_URL` — public link to the Weekend-Ship Playbook PDF
3. The welcome email is sent by the function itself (no automation to configure). New subscribers land in your Resend Audience; send the newsletter later via **Resend Broadcasts**.
4. Point your bio link (threads.com/@romellotcp) at the deployed URL.

## Test / demo mode
Open `index.html` directly (no server) and the form runs in **demo mode** — it shows the success state without sending, so you can see the flow. Real capture only happens once deployed with the env vars set.

## To switch providers (ConvertKit/Kit, MailerLite, etc.)
Change `SUBSCRIBE_ENDPOINT` at the bottom of `index.html`, or edit `api/subscribe.js` to call the other provider's API. The front-end just POSTs `{ email }` as JSON.

## Notes
- Fully responsive (stacks on mobile), light/dark toggle in the nav.
- Respects `prefers-reduced-motion`.
- Custom cursor and grain match the brand system; both disable on touch devices.
