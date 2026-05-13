import { db } from "@/lib/db";
import { wallpaperImages, wallpaperPackages } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const images = await db
      .select()
      .from(wallpaperImages)
      .where(eq(wallpaperImages.packageId, Number(id)))
      .orderBy(wallpaperImages.order);
    return NextResponse.json(images);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { url, publicId } = await req.json();

    const [img] = await db
      .insert(wallpaperImages)
      .values({ packageId: Number(id), url, publicId })
      .returning();

    // Set package cover to first image if not set
    const [pkg] = await db.select().from(wallpaperPackages).where(eq(wallpaperPackages.id, Number(id))).limit(1);
    if (pkg && !pkg.coverUrl) {
      await db.update(wallpaperPackages).set({ coverUrl: url }).where(eq(wallpaperPackages.id, Number(id)));
    }

    return NextResponse.json(img, { status: 201 });
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
    const { imageId, publicId } = await req.json();

    await cloudinary.uploader.destroy(publicId);
    await db.delete(wallpaperImages).where(eq(wallpaperImages.id, Number(imageId)));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
