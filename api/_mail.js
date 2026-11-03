const nodemailer = require("nodemailer");

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function transport() {
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD are not set");
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

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
  const from = process.env.GMAIL_USER;
  await transport().sendMail({
    from: `"Blakmixed Entertainment" <${from}>`,
    to: d.to,
    bcc: process.env.NOTIFY_EMAIL || from, // copy to you for every sale
    replyTo: from,
    subject: `Your ticket is confirmed: ${d.event.EVENT_NAME}`,
    html: html(d)
  });
}

module.exports = { sendTicketEmail };
