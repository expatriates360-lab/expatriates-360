import Link from "next/link";
import { MapPin, Clock, DollarSign, ArrowRight, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Static placeholder jobs (will be replaced with Supabase queries in step 3)
const FEATURED_JOBS = [
  { id: "1", title: "Senior HSE Engineer", company: "Aramco Projects", location: "Riyadh, KSA", salary: "$8,000 – $12,000", duration: "12 months", category: "Safety & HSE" },
  { id: "2", title: "Civil Engineer", company: "Al-Rashid Construction", location: "Dubai, UAE", salary: "$6,000 – $9,000", duration: "24 months", category: "Engineering" },
  { id: "3", title: "Project Manager", company: "Gulf Bridge Consultants", location: "Doha, Qatar", salary: "$10,000 – $14,000", duration: "18 months", category: "Management" },
  { id: "4", title: "Electrical Technician", company: "PowerGrid KSA", location: "Jeddah, KSA", salary: "$4,500 – $6,500", duration: "12 months", category: "Engineering" },
  { id: "5", title: "Safety Officer", company: "OffShore Logistics", location: "Abu Dhabi, UAE", salary: "$5,000 – $7,000", duration: "12 months", category: "Safety & HSE" },
  { id: "6", title: "IT Infrastructure Lead", company: "SaudiTelecom", location: "Riyadh, KSA", salary: "$9,000 – $13,000", duration: "24 months", category: "IT" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Safety & HSE": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Engineering: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Management: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  IT: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

export function FeaturedJobsSection() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_JOBS.map((job) => (
            <Card
              key={job.id}
              className="group border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-5 space-y-4">
                {/* Category */}
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                    CATEGORY_COLORS[job.category] ??
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {job.category}
                </span>

                {/* Title + Company */}
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {job.company}
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
                    {job.salary}
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
