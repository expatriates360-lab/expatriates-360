"use server";

import Link from "next/link";
import { MapPin, Clock, DollarSign, ArrowRight, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase";

const CATEGORY_COLORS: Record<string, string> = {
  "Safety & HSE": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Engineering: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Management: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  IT: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  HSE: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Engineer: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Admin: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
  Supervisor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Foreman: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  Technician: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  Skilled: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  Helper: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
};

export async function FeaturedJobsSection() {
  const supabase = createAdminClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, job_title, company_name, location, salary_rate, duration, category")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Opportunities</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="gradient-text">Featured Jobs</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Top-reviewed opportunities handpicked for expat professionals this week.
          </p>
        </div>

        {/* Job Grid */}
        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="group border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-5 space-y-4">
                  {/* Category */}
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                      CATEGORY_COLORS[job.category] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {job.category}
                  </span>

                  {/* Title + Company */}
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
                      {job.job_title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {job.company_name}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                      {job.salary_rate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                      {job.duration}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 py-5"
                    asChild
                  >
                    <Link href={`/jobs/${job.id}`}>
                      View Details
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-base py-12">
            More opportunities coming soon!
          </div>
        )}

        {/* View All */}
        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary" asChild>
            <Link href="/jobs">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
