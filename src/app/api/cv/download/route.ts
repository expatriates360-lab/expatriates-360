import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCvDownloadUrl } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase";

// Generates a short-lived (1h) signed download URL for a candidate's CV.
// The caller must be authenticated. Admins can download any CV.
// Regular users can only download CVs of active (non-deleted) profiles.

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get("userId");

  if (!targetUserId) {
    return NextResponse.json({ error: "userId query param required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Fetch target profile — ensure they are active and have a CV
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("cv_url, deleted_at, role")
    .eq("id", targetUserId)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Check caller permissions
  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const isAdmin = caller?.role === "admin";

  if (!isAdmin && profile.deleted_at) {
    return NextResponse.json({ error: "Profile not available" }, { status: 404 });
  }

  if (!profile.cv_url) {
    return NextResponse.json({ error: "No CV on file" }, { status: 404 });
  }

  try {
    const downloadUrl = await getCvDownloadUrl(profile.cv_url);
    return NextResponse.json({ url: downloadUrl });
  } catch (e) {
    console.error("[CV Download] Failed to generate URL:", e);
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }
}
