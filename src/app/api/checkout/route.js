import { db } from "@/lib/db";
import { wallpaperPackages } from "@/lib/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  if (!stripe) {
    return NextResponse.json({ error: "Payments not configured yet." }, { status: 503 });
  }
  try {
    const { packageId, email } = await req.json();
    if (!packageId || !email) {
      return NextResponse.json({ error: "packageId and email required" }, { status: 400 });
    }

    const [pkg] = await db
      .select()
      .from(wallpaperPackages)
      .where(eq(wallpaperPackages.id, Number(packageId)))
      .limit(1);

    if (!pkg || !pkg.active || !pkg.stripePriceId) {
      return NextResponse.json({ error: "Package not available" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const photographerAccountId = process.env.STRIPE_PHOTOGRAPHER_ACCOUNT_ID;

    const sessionParams = {
      mode: "payment",
      customer_email: email,
      line_items: [{ price: pkg.stripePriceId, quantity: 1 }],
      success_url: `${baseUrl}/download?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#wallpapers`,
      metadata: { packageId: String(pkg.id), packageName: pkg.name },
    };

    // 20% platform fee, 80% to photographer via Stripe Connect
    if (photographerAccountId && photographerAccountId.startsWith("acct_")) {
      const feeAmount = Math.round(pkg.price * 0.2);
      sessionParams.payment_intent_data = {
        application_fee_amount: feeAmount,
        transfer_data: { destination: photographerAccountId },
      };
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
