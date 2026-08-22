// Vercel serverless function: POST /api/subscribe  ->  beehiiv v2 API
// Keeps your beehiiv API key server-side (never exposed to the browser).
//
// Set these in Vercel → Project → Settings → Environment Variables:
//   BEEHIIV_API_KEY       = your beehiiv API key
//   BEEHIIV_PUBLICATION_ID = pub_xxxxxxxx  (the publication to add subscribers to)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const API_KEY = process.env.BEEHIIV_API_KEY;
  const PUB_ID = process.env.BEEHIIV_PUBLICATION_ID;
  if (!API_KEY || !PUB_ID) {
    return res.status(500).json({ error: "Server not configured" });
  }

  try {
    const r = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,      // sends your beehiiv welcome/automation (delivers the Playbook)
          utm_source: "threads",
          utm_medium: "capture_page",
          referring_site: "mello-capture",
        }),
      }
    );

    if (!r.ok) {
      const detail = await r.text();
      console.error("beehiiv error", r.status, detail);
      return res.status(502).json({ error: "Subscription failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
