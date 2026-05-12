import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function GET() {
  try {
    const [user] = await db.select({
      profilePhotoUrl: users.profilePhotoUrl,
    }).from(users).limit(1);

    return NextResponse.json({ url: user?.profilePhotoUrl ?? null });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { url, publicId } = await req.json();

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const [existing] = await db.select().from(users).where(eq(users.id, Number(session.user.id))).limit(1);
    if (existing?.profilePhotoPublicId) {
      await cloudinary.uploader.destroy(existing.profilePhotoPublicId);
    }

    await db
      .update(users)
      .set({ profilePhotoUrl: url, profilePhotoPublicId: publicId })
      .where(eq(users.id, Number(session.user.id)));

    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
