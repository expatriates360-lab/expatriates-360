import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { fullName, email, message } = body as Record<string, string>;

  if (
    typeof fullName !== "string" || !fullName.trim() ||
    typeof email   !== "string" || !email.trim() ||
    typeof message !== "string" || !message.trim()
  ) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Basic email format guard
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("[contact] SMTP_USER or SMTP_PASS env vars are not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
      <h2 style="background: #0f172a; color: #fff; padding: 16px 24px; border-radius: 8px 8px 0 0; margin: 0;">
        New Contact Form Submission
      </h2>
      <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #475569; width: 120px; vertical-align: top;">Name</td>
            <td style="padding: 8px 0; color: #0f172a;">${fullName.trim()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #475569; vertical-align: top;">Email</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${email.trim()}" style="color: #2563eb;">${email.trim()}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #475569; vertical-align: top;">Message</td>
            <td style="padding: 8px 0; color: #0f172a; white-space: pre-wrap;">${message.trim()}</td>
          </tr>
        </table>
      </div>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 16px; text-align: center;">
        Sent from the Expatriates 360 contact form &bull; Reply directly to reach the sender.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Expatriates 360 Contact" <${SMTP_USER}>`,
      to: "iamtabeenhaider@gmail.com",
      replyTo: `"${fullName.trim()}" <${email.trim()}>`,
      subject: `New message from ${fullName.trim()}`,
      html,
    });
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
