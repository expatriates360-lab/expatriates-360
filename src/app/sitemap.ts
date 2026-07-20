import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://hunared.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/candidates`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Only publicly-visible, approved jobs
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, created_at")
    .eq("status", "approved");

  const jobRoutes: MetadataRoute.Sitemap = (jobs ?? []).map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: job.created_at ? new Date(job.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Only job-seeker profiles, excluding soft-deleted
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, created_at")
    .eq("role", "seeker")
    .is("deleted_at", null);

  const candidateRoutes: MetadataRoute.Sitemap = (profiles ?? []).map((profile) => ({
    url: `${baseUrl}/candidates/${profile.id}`,
    lastModified: profile.created_at ? new Date(profile.created_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...jobRoutes, ...candidateRoutes];
}