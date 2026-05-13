import { db } from "@/lib/db";
import { wallpaperPackages, wallpaperImages } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pkgs = await db
      .select()
      .from(wallpaperPackages)
      .where(eq(wallpaperPackages.active, true))
      .orderBy(asc(wallpaperPackages.order));

    const images = await db.select().from(wallpaperImages).orderBy(asc(wallpaperImages.order));

    const result = pkgs.map((p) => ({
      ...p,
      images: images.filter((img) => img.packageId === p.id),
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description, price } = await req.json();
    if (!name || !price) return NextResponse.json({ error: "name and price required" }, { status: 400 });

    const priceInCents = Math.round(Number(price) * 100);

    // Save to DB first — package exists even if Stripe isn't configured yet
    const [pkg] = await db
      .insert(wallpaperPackages)
      .values({
        name,
        description: description || null,
        price: priceInCents,
      })
      .returning();

    // Wire up Stripe product + price if key is available
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const { stripe } = await import("@/lib/stripe");
        const product = await stripe.products.create({ name });
        const stripePrice = await stripe.prices.create({
          product: product.id,
          unit_amount: priceInCents,
          currency: "aud",
        });
        const [updated] = await db
          .update(wallpaperPackages)
          .set({ stripeProductId: product.id, stripePriceId: stripePrice.id })
          .where(eq(wallpaperPackages.id, pkg.id))
          .returning();
        return NextResponse.json(updated, { status: 201 });
      } catch (stripeErr) {
        console.error("Stripe setup failed (package saved without Stripe):", stripeErr.message);
      }
    }

    return NextResponse.json(pkg, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}
