# SAS Photography Studio

A portfolio and storefront I built for a photographer friend. It's a full-stack Next.js app — photo galleries, a wallpaper store with Stripe payments, and an admin dashboard to manage everything without touching code.

## What it does

- **Carousel** — full-viewport slideshow on the landing page. Desktop shows landscape (16:9) shots, mobile switches to portrait (9:16) automatically. Auto-advances every 5 seconds, swipeable.
- **Named galleries** — tabbed masonry layout with a lightbox. The photographer can create gallery categories (Nature, Cars, etc.) from the admin and assign photos to them.
- **Wallpaper store** — customers pick a package, pay once via Stripe, and get a download link by email + a permanent download page. 20% platform fee, 80% to the photographer via Stripe Connect.
- **Admin dashboard** — upload photos, manage galleries, create wallpaper packages, drag-drop wallpaper images. No code needed after setup.

## Stack

- **Next.js 16** (App Router)
- **NeonDB** (Postgres) + **Drizzle ORM**
- **Cloudinary** — image storage and delivery
- **Stripe** — checkout, webhooks, Connect for payment splitting
- **Resend** — transactional emails (download links)
- **Tailwind CSS v4** + **Framer Motion**
- Deployed on **Vercel**

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env.local` with the following:

```env
# Neon Postgres
DATABASE_URL=

# Auth.js
AUTH_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend
RESEND_API_KEY=
NOTIFICATION_EMAIL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PHOTOGRAPHER_ACCOUNT_ID=   # acct_xxxx — for the 20/80 payment split

# App
NEXT_PUBLIC_URL=https://yourdomain.com
```

## Database

I wrote a custom migration script because drizzle-kit push needs an interactive TTY (doesn't work in CI or non-interactive shells):

```bash
node scripts/migrate.js
```

Runs raw SQL with `IF NOT EXISTS` guards — safe to run multiple times.

## Admin access

Hit `/admin` — it's behind NextAuth so you need a user in the DB. The SAS logo on the public site has a hidden 5-tap easter egg that redirects to `/admin` too.

## Stripe webhooks (local dev)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Paste the webhook secret it gives you into `STRIPE_WEBHOOK_SECRET`.

## Payment split

Stripe Connect handles the 20/80 split at checkout. The photographer needs a Stripe account — grab their `acct_xxxx` ID from their Stripe dashboard and set it as `STRIPE_PHOTOGRAPHER_ACCOUNT_ID`. If that env var isn't set, the full amount goes to the platform account.
