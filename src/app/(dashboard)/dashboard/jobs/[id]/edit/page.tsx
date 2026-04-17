import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import { EditJobForm } from "@/components/jobs/EditJobForm";
import type { Job } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const supabase = createAdminClient();

  // Confirm user is an employer
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile || profile.role !== "employer") redirect("/dashboard");

  // Fetch the job
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job) notFound();

  // Ensure the employer owns this job
  if (job.employer_id !== userId) redirect("/dashboard/jobs");

  return <EditJobForm job={job as Job} />;
}
