const cfg = require("./_config");

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

// Creates a Paystack transaction and returns the Paystack checkout URL.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: "Payments are not configured yet." });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim().slice(0, 30);
  const ticket = cfg.TICKETS.find((t) => t.id === body.ticket);

  if (!ticket) return res.status(400).json({ error: "Please choose a valid ticket." });
  if (name.length < 2) return res.status(400).json({ error: "Please enter your full name." });
  if (!emailOk(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (phone.replace(/\D/g, "").length < 7) return res.status(400).json({ error: "Please enter a valid phone number." });

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const base = (process.env.SITE_URL || `https://${host}`).replace(/\/$/, "");

  try {
    const r = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: ticket.price * 100, // Paystack uses kobo
        currency: cfg.CURRENCY,
        callback_url: `${base}/success.html`,
        metadata: {
          source: "blakmixed-site",
          ticket_id: ticket.id,
          ticket_name: ticket.name,
          event: cfg.EVENT_NAME,
          name,
          phone,
          custom_fields: [
            { display_name: "Name", variable_name: "name", value: name },
            { display_name: "Phone", variable_name: "phone", value: phone },
            { display_name: "Ticket", variable_name: "ticket", value: `${ticket.name} (${cfg.EVENT_NAME})` }
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
