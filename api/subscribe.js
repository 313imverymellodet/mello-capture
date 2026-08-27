// Vercel serverless function: POST /api/subscribe  ->  Resend
// 1) Adds the email to a Resend Audience (your list)
// 2) Sends the branded welcome email with the Weekend-Ship Playbook link
//
// Set these in Vercel -> Project -> Settings -> Environment Variables:
//   RESEND_API_KEY      = re_xxxxxxxx
//   RESEND_AUDIENCE_ID  = your audience id (Resend -> Audiences)
//   RESEND_FROM         = "Mello <mello@learnwithmello.com>"  (domain must be verified in Resend)
//   PLAYBOOK_URL        = public link to the Weekend-Ship Playbook PDF

const RESEND = "https://api.resend.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const API_KEY = process.env.RESEND_API_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
  const FROM = process.env.RESEND_FROM;
  const PLAYBOOK_URL = process.env.PLAYBOOK_URL || "#";
  if (!API_KEY || !AUDIENCE_ID || !FROM) {
    return res.status(500).json({ error: "Server not configured" });
  }

  const auth = { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" };

  try {
    // 1) Add to audience (idempotent-ish: if they already exist, Resend errors — we don't block the welcome)
    await fetch(`${RESEND}/audiences/${AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ email, unsubscribed: false }),
    }).catch(() => {});

    // 2) Send the welcome email
    const r = await fetch(`${RESEND}/emails`, {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: "You're in — here's the Weekend-Ship Playbook 🛠️",
        html: welcomeHtml(PLAYBOOK_URL),
        text: welcomeText(PLAYBOOK_URL),
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("resend email error", r.status, detail);
      return res.status(502).json({ error: "Could not send welcome" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

function welcomeText(url) {
  return `Hey - Mello here.

Real quick about me: I work a full-time IT job for a pro sports team, and I've still shipped 25+ apps, games, and tools on the side. Nights, lunch breaks, weekends. I never quit the job - and that's kind of the whole point.

Here's what you signed up for - the Weekend-Ship Playbook: ${url}
It's the exact process I use to take an idea to a shipped thing in a single weekend. Steal all of it.

Going forward you'll get a short build log from me - what I shipped, what broke, what it taught me, and the occasional thing I make that you might actually want. No fluff.

One reply I'd love: what's the one thing you'd build this weekend if you knew you couldn't get it wrong? Hit reply and tell me. I read every one.

Talk soon,
Mello
(the guy building things after 5pm)`;
}

function welcomeHtml(url) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F5F0E8;">
  <div style="max-width:560px;margin:0 auto;padding:36px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1A1714;line-height:1.7;">
    <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#C42B2B;font-weight:700;margin-bottom:22px;">MELLO &bull; THE 9-TO-5 BUILDER</div>

    <p style="font-size:16px;margin:0 0 16px;">Hey — Mello here.</p>

    <p style="font-size:15px;margin:0 0 16px;">Real quick about me: I work a full-time IT job for a pro sports team, and I've still shipped <b>25+ apps, games, and tools</b> on the side. Nights, lunch breaks, weekends. I never quit the job — and that's kind of the whole point.</p>

    <p style="font-size:15px;margin:0 0 22px;">Here's what you signed up for:</p>

    <div style="text-align:center;margin:0 0 26px;">
      <a href="${url}" style="display:inline-block;background:#C42B2B;color:#F5F0E8;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:.5px;padding:15px 30px;border-radius:4px;">Get the Weekend-Ship Playbook →</a>
    </div>

    <p style="font-size:15px;margin:0 0 16px;">It's the exact process I use to take an idea to a shipped thing in a single weekend. Steal all of it.</p>

    <p style="font-size:15px;margin:0 0 16px;">Going forward you'll get a short <b>build log</b> from me — what I shipped, what broke, what it taught me, and the occasional thing I make that you might actually want. No fluff, no 5,000-word "value bombs."</p>

    <p style="font-size:15px;margin:0 0 22px;">One reply I'd love: <b>what's the one thing you'd build this weekend if you knew you couldn't get it wrong?</b> Hit reply and tell me — I read every one.</p>

    <div style="border-top:1px solid #D5CDBF;padding-top:18px;font-size:14px;color:#3A3530;">
      Talk soon,<br>
      <b>Mello</b><br>
      <span style="color:#6A6258;">the guy building things after 5pm</span>
    </div>
  </div>
</body></html>`;
}
