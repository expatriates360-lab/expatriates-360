import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";
import type { UserRole } from "@/types/database";

interface SaveProfileBody {
  role: UserRole;
  fullName: string;
  username?: string | null;
  phone?: string | null;
  gender?: string | null;
  location?: string | null;
  profession?: string | null;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  cvUrl?: string | null;
  companyCr?: string | null;
  companyWebsite?: string | null;
  companyAddress?: string | null;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SaveProfileBody;
  try {
    body = await req.json() as SaveProfileBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.fullName?.trim() || !body.role) {
    return NextResponse.json({ error: "fullName and role are required" }, { status: 400 });
  }

  // Validate role
  const validRoles: UserRole[] = ["seeker", "employer", "admin"];
  if (!validRoles.includes(body.role) || body.role === "admin") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  const supabase = createAdminClient();

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    role: body.role,
    full_name: body.fullName.trim(),
    email,
    username: body.username?.trim() ?? null,
    phone: body.phone?.trim() ?? null,
    gender: body.gender ?? null,
    location: body.location ?? null,
    profession: body.profession ?? null,
    avatar_url: body.avatarUrl ?? null,
    avatar_public_id: body.avatarPublicId ?? null,
    cv_url: body.cvUrl ?? null,
    company_cr: body.companyCr ?? null,
    company_website: body.companyWebsite ?? null,
    company_address: body.companyAddress ?? null,
  });

  if (error) {
    console.error("[profile/save] Supabase error:", error.message);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
