import { db } from "@/lib/db";
import { purchases, wallpaperPackages } from "@/lib/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  if (!stripe) return NextResponse.json({ received: true });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { packageId } = session.metadata ?? {};
    const email = session.customer_email || session.customer_details?.email;

    if (!email || !packageId) return NextResponse.json({ received: true });

    try {
      // Upsert purchase record
      const existing = await db
        .select()
        .from(purchases)
        .where(eq(purchases.stripeSessionId, session.id))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(purchases).values({
          packageId: Number(packageId),
          customerEmail: email,
          stripeSessionId: session.id,
          emailSent: false,
        });
      }

      // Send download email via Resend
      const [pkg] = await db
        .select()
        .from(wallpaperPackages)
        .where(eq(wallpaperPackages.id, Number(packageId)))
        .limit(1);

      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
      const downloadUrl = `${baseUrl}/download?session_id=${session.id}`;

      await resend.emails.send({
        from: "SAS Photography <noreply@resend.dev>",
        to: email,
        subject: `Your download is ready — ${pkg?.name ?? "Wallpaper Package"}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#0E0D0C;color:#EDE8DF;">
            <h1 style="font-size:28px;letter-spacing:0.06em;color:#C9A96E;margin:0 0 8px;">SAS</h1>
            <p style="color:#EDE8DF99;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 32px;">Photography</p>
            <h2 style="font-size:20px;font-weight:700;margin:0 0 16px;">Thank you for your purchase!</h2>
            <p style="color:#EDE8DFaa;margin:0 0 24px;line-height:1.6;">
              Your <strong style="color:#C9A96E;">${pkg?.name ?? "wallpaper package"}</strong> is ready to download.
              Your link is valid indefinitely — bookmark it for future access.
            </p>
            <a href="${downloadUrl}" style="display:inline-block;background:#C9A96E;color:#0E0D0C;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;font-size:13px;padding:14px 28px;text-decoration:none;">
              Download Wallpapers →
            </a>
            <p style="color:#EDE8DF44;font-size:11px;margin-top:32px;">
              Questions? Reply to this email or reach us at captsas.media@gmail.com
            </p>
          </div>
        `,
      });

      // Mark email sent
      await db
        .update(purchases)
        .set({ emailSent: true })
        .where(eq(purchases.stripeSessionId, session.id));
    } catch (err) {
      console.error("Webhook processing error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
