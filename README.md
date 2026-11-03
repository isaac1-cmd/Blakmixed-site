# Blakmixed Entertainment: Paystack ticketing setup

## Files
- `index.html`, `styles.css`, `script.js`: the website
- `success.html`: page Paystack sends people back to after paying
- `api/_config.js`: **edit your ticket prices, descriptions and what's included here**
- `api/initialize.js`, `verify.js`, `webhook.js`, `tickets.js`, `_mail.js`: payment + email (server side)
- `admin.html` + `api/admin.js`: private sales dashboard (open `/admin.html`)
- `package.json`: tells Vercel to install `nodemailer`

All images are in this folder. When your Chill Out flyer is ready, save it here as `chill-out.jpeg` and it appears automatically.

## 1. Vercel environment variables
Vercel → your project → Settings → Environment Variables. Add:

| Name | Value |
|---|---|
| `PAYSTACK_SECRET_KEY` | Paystack dashboard → Settings → API Keys → **Secret key** (`sk_test_...` to test, `sk_live_...` when ready) |
| `GMAIL_USER` | `blakmixedentertainment@gmail.com` |
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
