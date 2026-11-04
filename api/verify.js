const cfg = require("./_config");

// Used by success.html to confirm a payment with Paystack (server-side).
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const reference = String(req.query.reference || "").trim();
  if (!secret) return res.status(500).json({ error: "Payments are not configured yet." });
  if (!/^[\w.-]{6,100}$/.test(reference)) return res.status(400).json({ error: "Invalid reference." });

  try {
    const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const data = await r.json();
    const t = data && data.data;
    if (!r.ok || !t || t.metadata?.source !== "blakmixed-site") {
      return res.status(404).json({ status: "not_found" });
    }
    const [u, d] = String(t.customer?.email || "").split("@");
    const email = d ? `${u.slice(0, 2)}***@${d}` : "";
    if (t.metadata.kind === "order") {
      return res.status(200).json({
        kind: "order",
        mode: t.metadata.mode,
        status: t.status,
        reference: t.reference,
        items: t.metadata.items || [],
        name: t.metadata.name,
        amount: t.amount / 100,
        email,
        whatsapp: cfg.WHATSAPP
      });
    }
    if (t.metadata.kind === "service") {
      return res.status(200).json({
        kind: "service",
        status: t.status,
        reference: t.reference,
        item: t.metadata.service_label,
        qty: t.metadata.qty,
        name: t.metadata.name,
        amount: t.amount / 100,
        email,
        whatsapp: cfg.WHATSAPP
      });
    }
    return res.status(200).json({
      kind: "ticket",
      status: t.status, // "success" | "failed" | "abandoned" ...
      reference: t.reference,
      ticket: t.metadata.ticket_name,
      event: t.metadata.event,
      name: t.metadata.name,
      amount: t.amount / 100,
      email
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not verify payment." });
  }
};
