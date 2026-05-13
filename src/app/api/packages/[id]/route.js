import { db } from "@/lib/db";
import { wallpaperPackages } from "@/lib/schema";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { name, description, price, active } = await req.json();

    const [existing] = await db.select().from(wallpaperPackages).where(eq(wallpaperPackages.id, Number(id))).limit(1);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (active !== undefined) updates.active = active;

    // If price changed, create a new Stripe price (Stripe prices are immutable)
    if (price !== undefined) {
      const priceInCents = Math.round(Number(price) * 100);
      if (priceInCents !== existing.price) {
        const newStripePrice = await stripe.prices.create({
          product: existing.stripeProductId,
          unit_amount: priceInCents,
          currency: "aud",
        });
        // Archive old price
        if (existing.stripePriceId) {
          await stripe.prices.update(existing.stripePriceId, { active: false }).catch(() => {});
        }
        updates.price = priceInCents;
        updates.stripePriceId = newStripePrice.id;
      }
    }

    if (name && existing.stripeProductId) {
      await stripe.products.update(existing.stripeProductId, { name }).catch(() => {});
    }

    const [updated] = await db
      .update(wallpaperPackages)
      .set(updates)
      .where(eq(wallpaperPackages.id, Number(id)))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    // Soft delete — deactivate instead of hard delete to preserve purchase records
    await db.update(wallpaperPackages).set({ active: false }).where(eq(wallpaperPackages.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
