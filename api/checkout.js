const cfg = require("./_config");

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

// Cart checkout for the Fashion store. Totals are always worked out here from _config.js.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: "Payments are not configured yet." });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const mode = body.mode === "custom" ? "custom" : body.mode === "catalog" ? "catalog" : "";
  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim().slice(0, 30);
  const address = String(body.address || "").trim().slice(0, 300);
  const notes = String(body.notes || "").trim().slice(0, 500);

  if (!mode) return res.status(400).json({ error: "Invalid order." });
  if (name.length < 2) return res.status(400).json({ error: "Please enter your full name." });
  if (!emailOk(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (phone.replace(/\D/g, "").length < 7) return res.status(400).json({ error: "Please enter a valid phone number." });
  if (mode === "catalog" && address.length < 5) return res.status(400).json({ error: "Please enter your delivery address (or write 'pickup')." });
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 30) return res.status(400).json({ error: "Your cart is empty." });

  // Merge duplicate lines, then price every line on the server
  const merged = new Map();
  for (const it of body.items) {
    const qty = parseInt(it && it.qty, 10);
    if (!it || typeof it.id !== "string" || !(qty >= 1)) return res.status(400).json({ error: "Invalid cart." });
    const size = mode === "catalog" ? String(it.size || "") : "";
    const key = it.id + "|" + size;
    merged.set(key, { id: it.id, size, qty: (merged.get(key)?.qty || 0) + qty });
  }

  const lines = [];
  let total = 0;
  for (const l of merged.values()) {
    if (l.qty > cfg.MAX_ORDER_QTY) return res.status(400).json({ error: `Maximum ${cfg.MAX_ORDER_QTY} of one item.` });
    let item, unit, label;
    if (mode === "catalog") {
      item = cfg.CATALOG.find((p) => p.id === l.id);
      if (!item || !(item.price > 0)) return res.status(400).json({ error: "An item in your cart is no longer available." });
      if (item.sizes && item.sizes.length && !item.sizes.includes(l.size)) return res.status(400).json({ error: `Please choose a size for ${item.name}.` });
      unit = item.price; label = item.name;
    } else {
      item = cfg.CUSTOMIZATION.find((p) => p.id === l.id);
      if (!item) return res.status(400).json({ error: "An item in your cart is no longer available." });
      unit = cfg.unitPrice(item, l.qty);
      if (!(unit > 0)) return res.status(400).json({ error: "An item in your cart has no price yet." });
      label = item.name;
    }
    total += unit * l.qty;
    lines.push({ n: label, q: l.qty, s: l.size, u: unit });
  }

  const summary = lines.map((x) => `${x.q}x ${x.n}${x.s ? " (" + x.s + ")" : ""}`).join("; ").slice(0, 400);
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const base = (process.env.SITE_URL || `https://${host}`).replace(/\/$/, "");

  try {
    const r = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: total * 100, // kobo
        currency: cfg.CURRENCY,
        callback_url: `${base}/success.html`,
        metadata: {
          source: "blakmixed-site",
          kind: "order",
          mode,
          items: lines,
          summary,
          name,
          phone,
          address,
          notes,
          custom_fields: [
            { display_name: "Name", variable_name: "name", value: name },
            { display_name: "Phone", variable_name: "phone", value: phone },
            { display_name: mode === "custom" ? "Customization order" : "Store order", variable_name: "order", value: summary },
            { display_name: "Address", variable_name: "address", value: address || "-" },
            { display_name: "Notes", variable_name: "notes", value: notes || "-" }
          ]
        }
      })
    });
    const data = await r.json();
    if (!r.ok || !data.status) {
      console.error("Paystack initialize failed:", data);
      return res.status(502).json({ error: "Could not start payment. Please try again." });
    }
    return res.status(200).json({ url: data.data.authorization_url, reference: data.data.reference });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
