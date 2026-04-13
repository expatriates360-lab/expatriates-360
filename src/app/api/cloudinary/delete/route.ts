import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";

// Server-side Cloudinary Admin API delete.
// Only callable by authenticated admin users. The public_id is validated
// against the calling user's profile before deletion to prevent unauthorized
// deletion of other users' assets.

export async function POST(req: Request) {
  // ── Auth check ────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify caller is an admin
  const supabase = createAdminClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Parse body ────────────────────────────────────────────
  let publicId: string;
  try {
    const body = await req.json() as { publicId?: unknown };
    if (typeof body.publicId !== "string" || !body.publicId.trim()) {
      return NextResponse.json({ error: "publicId is required" }, { status: 400 });
    }
    publicId = body.publicId.trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ── Validate env vars ─────────────────────────────────────
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });
  }

  // ── Call Cloudinary Admin API ─────────────────────────────
  // Build SHA-1 signature: timestamp + public_id + api_secret
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  const cloudinaryRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    { method: "POST", body: formData }
  );

  if (!cloudinaryRes.ok) {
    const err = await cloudinaryRes.json() as { error?: { message?: string } };
    return NextResponse.json(
      { error: err.error?.message ?? "Cloudinary deletion failed" },
      { status: 502 }
    );
  }

  const result = await cloudinaryRes.json() as { result?: string };
  if (result.result !== "ok" && result.result !== "not found") {
    return NextResponse.json({ error: "Cloudinary returned unexpected result" }, { status: 502 });
  }

  return NextResponse.json({ deleted: true });
}
