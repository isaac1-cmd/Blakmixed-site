const crypto = require("crypto");
const store = require("./_store");

const same = (a, b) => {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};

// Admin only: check a ticket in (or undo a mistake).
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const pass = process.env.ADMIN_PASSWORD, secret = process.env.PAYSTACK_SECRET_KEY;
  if (!pass || !secret) return res.status(500).json({ error: "Admin is not configured." });
  if (!same(req.headers["x-admin-password"] || "", pass)) {
    await new Promise((r) => setTimeout(r, 800));
    return res.status(401).json({ error: "Wrong password." });
  }
  if (!store.configured()) {
    return res.status(503).json({ error: "Check-in storage is not connected yet. In Vercel, add an Upstash Redis database to this project (see README), then redeploy." });
  }

  let body;
  try { body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {}; }
  catch { return res.status(400).json({ error: "Invalid request." }); }
  const reference = String(body.reference || "").trim();
  const action = body.action === "undo" ? "undo" : "checkin";
  if (!/^[\w.-]{6,100}$/.test(reference)) return res.status(400).json({ error: "Invalid reference." });

  try {
    if (action === "undo") {
      await store.undoCheckIn(reference);
      return res.status(200).json({ ok: true, undone: true });
    }

    // Make sure this is a real, paid TICKET from this site (not a booking or shop order)
    const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const d = await r.json();
    const t = d && d.data, m = (t && t.metadata) || {};
    if (!r.ok || !t || t.status !== "success" || m.source !== "blakmixed-site") return res.status(404).json({ error: "No paid ticket found with that reference." });
    const isTicket = m.kind === "ticket" || (!m.kind && !m.service_id && m.ticket_name);
    if (!isTicket) return res.status(400).json({ error: "That payment is not an event ticket." });

    const info = { at: new Date().toISOString() };
    const result = await store.checkIn(reference, info);
    if (!result.ok) return res.status(409).json({ error: "ALREADY CHECKED IN", already: true, at: result.existing && result.existing.at });
    return res.status(200).json({ ok: true, at: info.at, name: m.name, ticket: m.ticket_name });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: "Could not save the check-in. Please try again." });
  }
};
