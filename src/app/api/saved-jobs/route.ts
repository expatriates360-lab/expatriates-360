// src/app/api/saved-jobs/route.ts
// Saved Jobs (spec: Job Seeker Dashboard → Saved Jobs).
// GET    → list current user's saved jobs (with job details)
// POST   → save a job        { jobId }
// DELETE → unsave a job      { jobId }

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("saved_jobs" as any)
    .select("id, job_id, created_at, jobs ( id, job_title, company_name, location, category, salary_rate, status )")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: data ?? [] });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!rateLimit(`saved-jobs:${userId}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body: { jobId?: string } = await req.json();
  if (!body.jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("saved_jobs" as any)
    .upsert(
      { user_id: userId, job_id: body.jobId },
      { onConflict: "user_id,job_id", ignoreDuplicates: true }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: true });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: { jobId?: string } = await req.json();
  if (!body.jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("saved_jobs" as any)
    .delete()
    .eq("user_id", userId)
    .eq("job_id", body.jobId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: false });
}