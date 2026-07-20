// src/app/(dashboard)/dashboard/saved/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, MapPin, Loader2, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type SavedJob = {
  id: string;
  job_id: string;
  created_at: string;
  jobs: {
    id: string;
    job_title: string;
    company_name: string;
    location: string | null;
    category: string;
    salary_rate: string | null;
    status: string;
  } | null;
};

export default function SavedJobsPage() {
  const [saved, setSaved] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/saved-jobs")
      .then((r) => r.json())
      .then((d) => setSaved(d.saved ?? []))
      .catch(() => toast.error("Could not load saved jobs"))
      .finally(() => setLoading(false));
  }, []);

  async function remove(jobId: string) {
    const prev = saved;
    setSaved((s) => s.filter((x) => x.job_id !== jobId));
    const res = await fetch("/api/saved-jobs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    if (!res.ok) {
      setSaved(prev); // revert on failure
      toast.error("Could not remove job");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-primary" /> Saved Jobs
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Jobs you&apos;ve bookmarked to apply to later.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : saved.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <Bookmark className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No saved jobs yet.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {saved.map((item) =>
            item.jobs ? (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/jobs/${item.jobs.id}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {item.jobs.job_title}
                  </Link>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.jobs.company_name}
                    {item.jobs.location && (
                      <span className="inline-flex items-center gap-1 ml-2">
                        <MapPin className="h-3 w-3" /> {item.jobs.location}
                      </span>
                    )}
                  </p>
                  {item.jobs.status !== "approved" && (
                    <p className="text-xs text-amber-600 mt-0.5">
                      This job is no longer active.
                    </p>
                  )}
                </div>
                <Button size="sm" variant="ghost" className="gap-1 shrink-0" asChild>
                  <Link href={`/jobs/${item.jobs.id}`}>
                    View <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                  onClick={() => remove(item.job_id)}
                  aria-label="Remove saved job"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
