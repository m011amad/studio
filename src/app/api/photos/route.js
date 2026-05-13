import { db } from "@/lib/db";
import { photos } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orientation = searchParams.get("orientation");

    let query = db.select().from(photos).orderBy(photos.uploadedAt);
    if (orientation) query = query.where(eq(photos.orientation, orientation));

    const rows = await query;
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { url, publicId, title, orientation } = body;

    if (!url || !publicId) {
      return NextResponse.json({ error: "Missing url or publicId" }, { status: 400 });
    }

    const [photo] = await db
      .insert(photos)
      .values({ url, publicId, title, orientation: orientation ?? "landscape" })
      .returning();

    return NextResponse.json(photo, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
