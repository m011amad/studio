import { db } from "@/lib/db";
import { purchases, wallpaperPackages, wallpaperImages } from "@/lib/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) return NextResponse.json({ error: "session_id required" }, { status: 400 });

    // Verify with Stripe directly — doesn't depend on webhook timing
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const packageId = Number(session.metadata?.packageId);
    const email = session.customer_email || session.customer_details?.email;

    const [pkg] = await db
      .select()
      .from(wallpaperPackages)
      .where(eq(wallpaperPackages.id, packageId))
      .limit(1);

    const images = await db
      .select()
      .from(wallpaperImages)
      .where(eq(wallpaperImages.packageId, packageId))
      .orderBy(wallpaperImages.order);

    return NextResponse.json({ package: pkg, images, email });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
