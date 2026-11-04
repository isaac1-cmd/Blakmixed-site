const nodemailer = require("nodemailer");

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Works with any email service. Use SMTP_* settings (Brevo, Zoho, etc.) or the simple Gmail settings.
function transport() {
  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 587);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("Email is not set up: add SMTP_* or GMAIL_* variables in Vercel");
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

// The address emails are sent from (and where you get a copy)
const fromAddress = () => process.env.FROM_EMAIL || process.env.GMAIL_USER || process.env.SMTP_USER;

function html({ name, ticket, amount, reference, paidAt, event }) {
  const paid = paidAt ? new Date(paidAt).toLocaleString("en-NG", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Lagos" }) : "";
  const row = (k, v) => `<tr><td style="padding:10px 0;color:#888;font-size:12px;border-bottom:1px solid #2a2a2a">${k}</td><td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #2a2a2a">${v}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#050505;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:30px 12px"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#111;border:1px solid #D4AF37">
<tr><td style="padding:30px 32px 10px"><div style="color:#D4AF37;font-size:11px;letter-spacing:4px;font-weight:700">BLAKMIXED ENTERTAINMENT</div>
<h1 style="color:#fff;font-size:26px;margin:18px 0 8px">Payment confirmed ✓</h1>
<p style="color:#bbb;font-size:14px;line-height:1.6;margin:0">Hi ${esc(name)}, thank you! Your <b style="color:#fff">${esc(ticket)}</b> ticket for <b style="color:#fff">${esc(event.EVENT_NAME)}</b> is confirmed.</p></td></tr>
<tr><td style="padding:16px 32px"><table width="100%" cellpadding="0" cellspacing="0">
${row("Event", esc(event.EVENT_NAME))}${row("Date", esc(event.EVENT_DATE))}${row("Venue", esc(event.EVENT_VENUE))}
${row("Ticket", esc(ticket))}${row("Amount paid", "₦" + Number(amount).toLocaleString("en-NG"))}${paid ? row("Paid on", esc(paid)) : ""}
</table></td></tr>
<tr><td style="padding:6px 32px 28px"><div style="border:1px dashed #D4AF37;padding:16px;text-align:center">
<div style="color:#888;font-size:10px;letter-spacing:3px">TICKET REFERENCE</div>
<div style="color:#D4AF37;font-size:20px;font-weight:700;letter-spacing:1px;margin-top:6px">${esc(reference)}</div>
<div style="color:#888;font-size:12px;margin-top:8px">Show this email or reference at the entrance.</div></div></td></tr>
<tr><td style="padding:0 32px 28px;color:#666;font-size:11px;line-height:1.6">Questions? Reply to this email or message us on WhatsApp. See you there!</td></tr>
</table></td></tr></table></body></html>`;
}

async function sendTicketEmail(d) {
  const from = fromAddress();
  await transport().sendMail({
    from: `"Blakmixed Entertainment" <${from}>`,
    to: d.to,
    bcc: process.env.NOTIFY_EMAIL || from, // copy to you for every sale
    replyTo: from,
    subject: `Your ticket is confirmed: ${d.event.EVENT_NAME}`,
    html: html(d)
  });
}

function serviceHtml({ name, label, qty, amount, reference, paidAt, whatsapp }) {
  const paid = paidAt ? new Date(paidAt).toLocaleString("en-NG", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Lagos" }) : "";
  const row = (k, v) => `<tr><td style="padding:10px 0;color:#888;font-size:12px;border-bottom:1px solid #2a2a2a">${k}</td><td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #2a2a2a">${v}</td></tr>`;
  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello BLAKMIXED ENTERTAINMENT, this is ${name}. I just paid for "${label}". Payment reference: ${reference}.`)}`;
  return `<!doctype html><html><body style="margin:0;background:#050505;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:30px 12px"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#111;border:1px solid #D4AF37">
<tr><td style="padding:30px 32px 10px"><div style="color:#D4AF37;font-size:11px;letter-spacing:4px;font-weight:700">BLAKMIXED ENTERTAINMENT</div>
<h1 style="color:#fff;font-size:26px;margin:18px 0 8px">Payment received ✓</h1>
<p style="color:#bbb;font-size:14px;line-height:1.6;margin:0">Hi ${esc(name)}, thank you! We have received your payment for <b style="color:#fff">${esc(label)}</b>.</p></td></tr>
<tr><td style="padding:16px 32px"><table width="100%" cellpadding="0" cellspacing="0">
${row("Service", esc(label))}${Number(qty) > 1 ? row("Quantity", esc(qty)) : ""}${row("Amount paid", "₦" + Number(amount).toLocaleString("en-NG"))}${paid ? row("Paid on", esc(paid)) : ""}
</table></td></tr>
<tr><td style="padding:6px 32px 20px"><div style="border:1px dashed #D4AF37;padding:16px;text-align:center">
<div style="color:#888;font-size:10px;letter-spacing:3px">PAYMENT REFERENCE</div>
<div style="color:#D4AF37;font-size:20px;font-weight:700;letter-spacing:1px;margin-top:6px">${esc(reference)}</div></div></td></tr>
<tr><td style="padding:0 32px 28px"><p style="color:#bbb;font-size:14px;line-height:1.6;margin:0 0 16px"><b style="color:#fff">Next step:</b> we will follow up with you on WhatsApp to finalise the details.</p>
<a href="${wa}" style="display:inline-block;background:#fff;color:#000;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;padding:14px 22px">CONTINUE ON WHATSAPP</a></td></tr>
</table></td></tr></table></body></html>`;
}

async function sendServiceEmail(d) {
  const from = fromAddress();
  await transport().sendMail({
    from: `"Blakmixed Entertainment" <${from}>`,
    to: d.to,
    bcc: process.env.NOTIFY_EMAIL || from,
    replyTo: from,
    subject: `Payment received: ${d.label}`,
    html: serviceHtml(d)
  });
}

function orderHtml({ name, mode, items, address, notes, amount, reference, paidAt, whatsapp }) {
  const paid = paidAt ? new Date(paidAt).toLocaleString("en-NG", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Lagos" }) : "";
  const money = (n) => "₦" + Number(n).toLocaleString("en-NG");
  const row = (k, v, bold) => `<tr><td style="padding:10px 0;color:${bold ? "#fff" : "#bbb"};font-size:13px;border-bottom:1px solid #2a2a2a">${k}</td><td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #2a2a2a">${v}</td></tr>`;
  const lines = (items || []).map((i) => row(`${esc(i.q)} × ${esc(i.n)}${i.s ? " (" + esc(i.s) + ")" : ""}`, money(i.u * i.q))).join("");
  const summary = (items || []).map((i) => `${i.q}x ${i.n}${i.s ? " (" + i.s + ")" : ""}`).join(", ");
  const custom = mode === "custom";
  const msg = custom
    ? `Hello BLAKMIXED ENTERTAINMENT, this is ${name}. I just paid for my personalized customization order (${summary}). Payment reference: ${reference}. Here is my design idea: `
    : `Hello BLAKMIXED ENTERTAINMENT, this is ${name}. I just paid for my order (${summary}). Payment reference: ${reference}.`;
  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
  const next = custom
    ? "we will follow up with you on WhatsApp to talk through your design and get your customization started."
    : "we will confirm your order and arrange delivery with you. You can also reach us on WhatsApp anytime.";
  return `<!doctype html><html><body style="margin:0;background:#050505;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:30px 12px"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#111;border:1px solid #D4AF37">
<tr><td style="padding:30px 32px 10px"><div style="color:#D4AF37;font-size:11px;letter-spacing:4px;font-weight:700">BLAKMIXED FASHION</div>
<h1 style="color:#fff;font-size:26px;margin:18px 0 8px">Order confirmed ✓</h1>
<p style="color:#bbb;font-size:14px;line-height:1.6;margin:0">Hi ${esc(name)}, thank you! We have received your payment for your ${custom ? "personalized customization" : "Fashion store"} order.</p></td></tr>
<tr><td style="padding:16px 32px"><table width="100%" cellpadding="0" cellspacing="0">
${lines}${row("Total paid", money(amount), true)}${paid ? row("Paid on", esc(paid)) : ""}${address ? row("Delivery address", esc(address)) : ""}${notes ? row(custom ? "Your design notes" : "Notes", esc(notes)) : ""}
</table></td></tr>
<tr><td style="padding:6px 32px 20px"><div style="border:1px dashed #D4AF37;padding:16px;text-align:center">
<div style="color:#888;font-size:10px;letter-spacing:3px">ORDER REFERENCE</div>
<div style="color:#D4AF37;font-size:20px;font-weight:700;letter-spacing:1px;margin-top:6px">${esc(reference)}</div></div></td></tr>
<tr><td style="padding:0 32px 28px"><p style="color:#bbb;font-size:14px;line-height:1.6;margin:0 0 16px"><b style="color:#fff">Next step:</b> ${next}</p>
<a href="${wa}" style="display:inline-block;background:#fff;color:#000;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;padding:14px 22px">CONTINUE ON WHATSAPP</a></td></tr>
</table></td></tr></table></body></html>`;
}

async function sendOrderEmail(d) {
  const from = fromAddress();
  await transport().sendMail({
    from: `"Blakmixed Entertainment" <${from}>`,
    to: d.to,
    bcc: process.env.NOTIFY_EMAIL || from,
    replyTo: from,
    subject: d.mode === "custom" ? "Order confirmed: your personalized customization" : "Order confirmed: Blakmixed Fashion",
    html: orderHtml(d)
  });
}

module.exports = { sendTicketEmail, sendServiceEmail, sendOrderEmail };
