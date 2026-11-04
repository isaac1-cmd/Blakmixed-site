const cfg = require("./_config");

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

// Starts a Paystack payment for a service. The price comes from _config.js, never from the browser.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: "Payments are not configured yet." });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim().slice(0, 30);
  const svc = cfg.SERVICES.find((s) => s.id === body.service);

  if (!svc) return res.status(400).json({ error: "Please choose a valid service." });
  if (!(svc.price > 0)) return res.status(400).json({ error: "This service is booked through WhatsApp." });
  if (name.length < 2) return res.status(400).json({ error: "Please enter your full name." });
  if (!emailOk(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (phone.replace(/\D/g, "").length < 7) return res.status(400).json({ error: "Please enter a valid phone number." });

  let qty = 1;
  if (svc.unit) {
    qty = parseInt(body.qty, 10);
    if (!(qty >= 1 && qty <= cfg.MAX_QTY)) return res.status(400).json({ error: `Quantity must be between 1 and ${cfg.MAX_QTY}.` });
  }
  const label = `${svc.category}: ${svc.group ? svc.group + " - " : ""}${svc.name}`;

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const base = (process.env.SITE_URL || `https://${host}`).replace(/\/$/, "");

  try {
    const r = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: svc.price * qty * 100, // kobo
        currency: cfg.CURRENCY,
        callback_url: `${base}/success.html`,
        metadata: {
          source: "blakmixed-site",
          kind: "service",
          service_id: svc.id,
          service_label: label,
          category: svc.category,
          qty,
          unit_price: svc.price,
          name,
          phone,
          custom_fields: [
            { display_name: "Name", variable_name: "name", value: name },
            { display_name: "Phone", variable_name: "phone", value: phone },
            { display_name: "Service", variable_name: "service", value: label },
            { display_name: "Quantity", variable_name: "qty", value: String(qty) }
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
