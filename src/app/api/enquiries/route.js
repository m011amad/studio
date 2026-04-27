import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Save to database
    await db.insert(enquiries).values({ name, email, phone, message });

    // Send email notification
    await resend.emails.send({
      from: "Sas Photography <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Enquiry from ${name}`,
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 32px; background: #FFF9F0; border: 3px solid #2C2C2C;">
          <h1 style="font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #2C2C2C; margin: 0 0 8px 0;">
            New Enquiry
          </h1>
          <p style="color: #52C41A; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 32px 0;">
            Sas Photography
          </p>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 16px; background: #2C2C2C; color: #FFF9F0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; width: 100px;">Name</td>
              <td style="padding: 12px 16px; background: #fff; border: 2px solid #2C2C2C; border-left: none; color: #2C2C2C; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: #2C2C2C; color: #FFF9F0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-top: 2px solid #52C41A;">Email</td>
              <td style="padding: 12px 16px; background: #fff; border: 2px solid #2C2C2C; border-left: none; border-top: 2px solid #52C41A; color: #2C2C2C;">
                <a href="mailto:${email}" style="color: #52C41A; font-weight: 600;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: #2C2C2C; color: #FFF9F0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-top: 2px solid #52C41A;">Phone</td>
              <td style="padding: 12px 16px; background: #fff; border: 2px solid #2C2C2C; border-left: none; border-top: 2px solid #52C41A; color: #2C2C2C; font-weight: 600;">${phone || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: #2C2C2C; color: #FFF9F0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-top: 2px solid #52C41A; vertical-align: top;">Message</td>
              <td style="padding: 12px 16px; background: #fff; border: 2px solid #2C2C2C; border-left: none; border-top: 2px solid #52C41A; color: #2C2C2C; line-height: 1.6;">${message.replace(/\n/g, "<br/>")}</td>
            </tr>
          </table>

          <p style="margin: 24px 0 0 0; font-size: 11px; color: #2C2C2C; opacity: 0.4; text-transform: uppercase; letter-spacing: 1px;">
            Submitted via sasphotography.com
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
