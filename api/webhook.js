const crypto = require("crypto");
const cfg = require("./_config");
const { sendTicketEmail } = require("./_mail");

// Stop Vercel/Next from pre-parsing the body: we need the raw text to check the signature.
module.exports.config = { api: { bodyParser: false } };

async function rawBody(req) {
  if (req.readableEnded) return typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
  const chunks = [];
  for await (const c of req) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks).toString("utf8");
}

// Paystack calls this URL after every successful charge. We confirm it
// really came from Paystack, then email the customer.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).end();

  const raw = await rawBody(req);
  const expected = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  const given = String(req.headers["x-paystack-signature"] || "");
  const a = Buffer.from(expected), b = Buffer.from(given);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).end();

  let event;
  try { event = JSON.parse(raw); } catch { return res.status(400).end(); }

  if (event.event === "charge.success" && event.data?.metadata?.source === "blakmixed-site") {
    const t = event.data;
    try {
      await sendTicketEmail({
        to: t.customer.email,
        name: t.metadata.name,
        ticket: t.metadata.ticket_name,
        amount: t.amount / 100,
        reference: t.reference,
        paidAt: t.paid_at,
        event: cfg
      });
    } catch (err) {
      console.error("Email failed:", err);
      return res.status(500).end(); // Paystack will retry
    }
  }
  return res.status(200).end();
};
