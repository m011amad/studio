import { db } from "@/lib/db";
import { wallpaperPackages } from "@/lib/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
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

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [{ price: pkg.stripePriceId, quantity: 1 }],
      success_url: `${baseUrl}/download?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#wallpapers`,
      metadata: { packageId: String(pkg.id), packageName: pkg.name },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
