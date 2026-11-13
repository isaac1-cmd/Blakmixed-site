# Blakmixed Entertainment: Paystack ticketing setup

## Files
- `index.html`, `styles.css`, `script.js`: the website
- `success.html`: page Paystack sends people back to after paying
- `api/_config.js`: **edit your ticket prices, descriptions and what's included here**
- `api/book.js` + `api/services.js`: Book Us payments. **Set service prices in `api/_config.js`**
- `api/initialize.js`, `verify.js`, `webhook.js`, `tickets.js`, `_mail.js`: payment + email (server side)
- `admin.html` + `api/admin.js`: private sales dashboard (open `/admin.html`)
- `package.json`: tells Vercel to install `nodemailer`

All images are in this folder. When your Chill Out flyer is ready, save it here as `chill-out.jpeg` and it appears automatically.

## 1. Vercel environment variables
Vercel → your project → Settings → Environment Variables. Add:

| Name | Value |
|---|---|
| `PAYSTACK_SECRET_KEY` | Paystack dashboard → Settings → API Keys → **Secret key** (`sk_test_...` to test, `sk_live_...` when ready) |
| `GMAIL_USER` | *(Gmail option)*  `blakmixedentertainment@gmail.com` |
| `GMAIL_APP_PASSWORD` | A Gmail **App Password** (Google Account → Security → 2-Step Verification on → App passwords). Not your normal password. |
| `ADMIN_PASSWORD` | A strong password of your choice for `/admin.html` |
| `NOTIFY_EMAIL` | *(optional)* where you get a copy of every sale. Defaults to GMAIL_USER |
| `SITE_URL` | *(optional)* e.g. `https://yourdomain.com`, if you use a custom domain |

Never put the secret key in `script.js` or any front-end file. After adding variables, **redeploy**.

## 2. Paystack webhook (this is what sends the confirmation email)
Paystack dashboard → Settings → API Keys & Webhooks → set **Webhook URL** to:

`https://YOUR-SITE.vercel.app/api/webhook`

## 3. Test
Use the `sk_test_` key and a Paystack test card, buy a ticket, confirm you land on the success page and the email arrives. Then swap to the `sk_live_` key and redeploy.

## Email options
**Option A: Gmail:** set `GMAIL_USER` and `GMAIL_APP_PASSWORD` (needs 2-Step Verification on).

**Option B: Brevo (no Gmail App Password needed):** set `SMTP_HOST=smtp-relay.brevo.com`, `SMTP_PORT=587`, `SMTP_USER` (login shown in Brevo → SMTP & API), `SMTP_PASS` (your Brevo SMTP key) and `FROM_EMAIL` (your verified sender address).

## Fashion store (Purchase Now)
- `shop.js` (main folder): the store screens (catalog, filter, cart, checkout)
- `api/shop.js`, `api/checkout.js`: product lists and Paystack checkout (a different file from the main-folder `shop.js`)
- **Set products, images, sizes and customization prices in `api/_config.js`** (CATALOG and CUSTOMIZATION). Catalog products and prices are real. The **customization prices are still SAMPLES**: replace them.
- Product pictures: save them in the main folder and put the file name in `image`.

## Emails (each purchase type has its own)
- Ticket: badge **EVENT TICKET**, subject "Your ticket is confirmed…"
- Booking (Media/Events): badge **BOOKING CONFIRMATION**, subject "Booking confirmed…"
- Fashion order: badge **ORDER CONFIRMATION** or **CUSTOMIZATION ORDER**

Which email is sent is decided in `api/webhook.js` by the payment's `kind`, so a payment of one type can never get another type's email.

## Ticket check-in (admin panel)
In `/admin.html` every **ticket** has a **Check in** button. Once pressed it shows "✓ Checked in" with the time, and pressing it again for the same ticket (even from another phone) is refused with "ALREADY CHECKED IN". There is a small **Undo** for mistakes, a "Checked in X / Y" counter, a check-in filter and a Checked in column in the CSV.

**One-time setup (needed so check-ins are remembered):**
1. Vercel → your project → **Storage** → **Create Database** → choose **Upstash Redis** (free plan) → connect it to this project.
2. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. **Redeploy.**

Until this is done, the sales list still works but the Check in buttons will say storage is not connected.
Files: `api/checkin.js`, `api/_store.js`.
