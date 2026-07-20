import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { MapPin, Clock, DollarSign, Users, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, JOB_CATEGORIES } from "@/lib/constants";
import { COUNTRIES } from "@/lib/countries";
import { JobsFilter } from "@/components/jobs/JobsFilter";
import type { Job } from "@/types/database";

interface SearchParams {
  search?: string;
  category?: string;
  country?: string;
  city?: string;
  employmentType?: string;
  page?: string;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const search = sp.search ?? "";
  const category = sp.category ?? "";
  const country = sp.country ?? "";
  const city = sp.city ?? "";
  const employmentType = sp.employmentType ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const limit = 12;
  const from = (page - 1) * limit;

  let jobs: Partial<Job>[] = [];
  let total = 0;
  // Full spec category list for the filter dropdown — always complete,
  // not limited to categories that already have posted jobs.
  const categories: string[] = [...JOB_CATEGORIES];

  try {
    const supabase = createAdminClient();

    let query = supabase
      .from("jobs")
      .select(
        "id, job_title, company_name, location, country, city, employment_type, salary_rate, duration, category, positions, created_at",
        { count: "exact" }
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);

    if (category) query = query.eq("category", category);
    if (country) query = query.eq("country", country);
    if (city) query = query.ilike("city", `%${city}%`);
    if (employmentType === "permanent" || employmentType === "temporary" || employmentType === "task_force") {
      query = query.eq("employment_type", employmentType);
    }
    if (search) query = query.ilike("job_title", `%${search}%`);

    const { data, count } = await query;
    jobs = data ?? [];
    total = count ?? 0;
  } catch {
    // DB not configured — show empty state
  }

  const totalPages = Math.ceil(total / limit);
  const hasFilters = !!(search || category || country || city || employmentType);
  const activeCountry = COUNTRIES.find((c) => c.code === country);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border py-12 pt-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="gradient-text">Hunared Job Board</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            {total > 0
              ? `${total.toLocaleString()} opportunit${total !== 1 ? "ies" : "y"} across the globe`
              : "Find your next international opportunity"}
          </p>
          <JobsFilter
            defaultSearch={search}
            defaultCategory={category}
            defaultCountry={country}
            defaultCity={city}
            categories={categories}
          />
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {hasFilters && (
          <p className="text-sm text-muted-foreground mb-5">
            {total} result{total !== 1 ? "s" : ""} found
            {search && ` for "${search}"`}
            {category && ` in ${category}`}
            {employmentType && ` · ${employmentType.replace("_", " ")}`}
            {activeCountry && ` · ${activeCountry.name}`}
            {city && ` · ${city}`}
          </p>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No jobs found.</p>
            {hasFilters && (
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/jobs">Clear filters</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {page > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/jobs?${buildParams({ search, category, country, city, employmentType, page: page - 1 })}`}
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
                      href={`/jobs?${buildParams({ search, category, country, city, employmentType, page: page + 1 })}`}
                    >
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function JobCard({ job }: { job: Partial<Job> }) {
  const createdAt = job.created_at
    ? new Date(job.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <Card className="group hover:border-primary/40 hover:shadow-md transition-all duration-200">
      <CardContent className="pt-5 pb-4 flex flex-col h-full">
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {job.category && (
            <Badge
              className={cn(
                "text-xs",
                CATEGORY_COLORS[job.category] ?? CATEGORY_COLORS["Other"]
              )}
            >
              {job.category}
            </Badge>
          )}
          {job.employment_type && job.employment_type !== "permanent" && (
            <Badge variant="outline" className="text-xs capitalize">
              {job.employment_type.replace("_", " ")}
            </Badge>
          )}
        </div>
        <Link href={`/jobs/${job.id}`} className="group/title">
          <h3 className="font-semibold text-foreground group-hover/title:text-primary transition-colors leading-snug mb-1">
            {job.job_title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3">{job.company_name}</p>

        <div className="space-y-1.5 text-xs text-muted-foreground flex-1">
          {job.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {job.location}
            </div>
          )}
          {job.salary_rate && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 shrink-0" />
              {job.salary_rate}
            </div>
          )}
          {job.duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {job.duration}
            </div>
          )}
          {job.positions && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0" />
              {job.positions} position{job.positions !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{createdAt}</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 text-xs hover:text-primary"
            asChild
          >
            <Link href={`/jobs/${job.id}`}>
              View <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function buildParams(p: {
  search: string;
  category: string;
  country: string;
  city: string;
  employmentType: string;
  page: number;
}) {
  const params = new URLSearchParams();
  if (p.search) params.set("search", p.search);
  if (p.category) params.set("category", p.category);
  if (p.country) params.set("country", p.country);
  if (p.city) params.set("city", p.city);
  if (p.employmentType) params.set("employmentType", p.employmentType);
  if (p.page > 1) params.set("page", p.page.toString());
  return params.toString();
}