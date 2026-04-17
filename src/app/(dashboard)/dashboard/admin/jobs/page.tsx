import { createAdminClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobModerationActions } from "@/components/admin/JobModerationActions";
import { AutoApproveJobsToggle } from "@/components/admin/AutoApproveJobsToggle";

export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
  page?: string;
}

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createAdminClient();

  // Verify admin
  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (caller?.role !== "admin") redirect("/dashboard");

  const sp = await searchParams;
  const statusFilter = sp.status ?? "pending";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const limit = 15;
  const from = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let jobs: any[] = [];
  let total = 0;

  try {
    let query = supabase
      .from("jobs")
      .select(
        "id, job_title, company_name, location, category, status, created_at, employer_id, positions",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter as "pending" | "approved" | "rejected");
    }

    const { data, count } = await query;
    jobs = data ?? [];
    total = count ?? 0;
  } catch {
    // empty state
  }

  const totalPages = Math.ceil(total / limit);

  // Counts for tab badges
  let pendingCount = 0;
  let approvedCount = 0;
  let rejectedCount = 0;
  try {
    const { data: counts } = await supabase
      .from("jobs")
      .select("status");
    if (counts) {
      pendingCount = counts.filter((j) => j.status === "pending").length;
      approvedCount = counts.filter((j) => j.status === "approved").length;
      rejectedCount = counts.filter((j) => j.status === "rejected").length;
    }
  } catch {
    // ignore
  }

  const STATUS_TABS = [
    { label: "Pending", value: "pending", count: pendingCount },
    { label: "Approved", value: "approved", count: approvedCount },
    { label: "Rejected", value: "rejected", count: rejectedCount },
    { label: "All", value: "all", count: pendingCount + approvedCount + rejectedCount },
  ];

  // Fetch site_settings for auto-approve toggle
  let autoApproveJobs = false;
  try {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("auto_approve_jobs")
      .single();
    autoApproveJobs = settings?.auto_approve_jobs ?? false;
  } catch {
    // ignore — default to false
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job Queue</h1>
        <p className="text-sm text-muted-foreground">Review and moderate job postings</p>
      </div>

      {/* Auto-approve toggle */}
      <AutoApproveJobsToggle initialValue={autoApproveJobs} />

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={statusFilter === tab.value ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={`/dashboard/admin/jobs?status=${tab.value}`}>
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
            </Link>
          </Button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-0 pb-0 overflow-x-auto">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Briefcase className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground">
                No {statusFilter !== "all" ? statusFilter : ""} jobs.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-4 font-medium">Job Title</th>
                  <th className="text-left py-3 px-4 font-medium">Company</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <Link
                          href={`/jobs/${job.id}`}
                          target="_blank"
                          className="font-medium hover:text-primary hover:underline transition-colors"
                        >
                          {job.job_title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {job.positions} position{job.positions !== 1 ? "s" : ""} · {job.location}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {job.company_name ?? "—"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="text-xs">
                        {job.category ?? "—"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {job.created_at
                        ? new Date(job.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <JobModerationActions jobId={job.id} currentStatus={job.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/dashboard/admin/jobs?status=${statusFilter}&page=${page - 1}`}
              >
                Previous
              </Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/dashboard/admin/jobs?status=${statusFilter}&page=${page + 1}`}
              >
                Next
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
