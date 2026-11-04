const crypto = require("crypto");

const same = (a, b) => {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};

// Password-protected sales list, read live from Paystack.
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const pass = process.env.ADMIN_PASSWORD, secret = process.env.PAYSTACK_SECRET_KEY;
  if (!pass || !secret) return res.status(500).json({ error: "Admin is not configured. Set ADMIN_PASSWORD in Vercel." });

  if (!same(req.headers["x-admin-password"] || "", pass)) {
    await new Promise((r) => setTimeout(r, 800)); // slows down password guessing
    return res.status(401).json({ error: "Wrong password." });
  }

  try {
    const sales = [];
    for (let page = 1; page <= 20; page++) { // up to 2,000 sales
      const r = await fetch(`https://api.paystack.co/transaction?status=success&perPage=100&page=${page}`, {
        headers: { Authorization: `Bearer ${secret}` }
      });
      const d = await r.json();
      if (!r.ok || !d.status) throw new Error(d.message || "Paystack error");
      for (const t of d.data) {
        const m = t.metadata || {};
        if (m.source !== "blakmixed-site") continue;
        sales.push({
          date: t.paid_at || t.created_at,
          name: m.name || "",
          email: t.customer?.email || "",
          phone: m.phone || "",
          ticket: m.kind === "order" ? m.summary || "Order"
            : m.kind === "service" ? `${m.service_label || "Service"}${m.qty > 1 ? " ×" + m.qty : ""}`
            : m.ticket_name || "",
          event: m.kind === "order" ? (m.mode === "custom" ? "Customization" : "Fashion Store") : m.kind === "service" ? "Services" : m.event || "",
          details: [m.address, m.notes].filter(Boolean).join(" | "),
          amount: t.amount / 100,
          reference: t.reference
        });
      }
      if (d.data.length < 100) break;
    }
    res.status(200).json({ sales });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Could not load sales from Paystack." });
  }
};
