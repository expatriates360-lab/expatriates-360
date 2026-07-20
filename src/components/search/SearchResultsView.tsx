"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase, User, ShoppingBag, GraduationCap, Search as SearchIcon, MapPin, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/countries";
import { useGeoDetection } from "@/hooks/useGeoDetection";

type Job = {
  id: string;
  job_title: string;
  job_description: string;
  category: string;
  location: string | null;
  company_name: string;
  salary_rate: string | null;
  country?: string | null;
  city?: string | null;
  employment_type?: string;
  created_at: string;
};
type Candidate = {
  id: string;
  full_name: string;
  profession: string | null;
  location: string | null;
  avatar_url: string | null;
  country?: string | null;
  city?: string | null;
};

type Listing = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  price: string;
  currency: string;
  image_url: string | null;
  country?: string | null;
  city?: string | null;
  subcategory?: string | null;
};

type Article = {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string | null;
};

interface Props {
  query: string;
  country: string;
  city: string;
  results: {
    jobs: Job[];
    candidates: Candidate[];
    listings: Listing[];
    articles: Article[];
  };
}

type TabKey = "all" | "jobs" | "candidates" | "listings" | "articles";

export function SearchResultsView({ query, country, city, results }: Props) {
  const router = useRouter();
  const geo = useGeoDetection();
  const [cityInput, setCityInput] = useState(city);
  const [tab, setTab] = useState<TabKey>("all");
  const totalCount =
    results.jobs.length +
    results.candidates.length +
    results.listings.length +
    results.articles.length;

  function updateFilters(newCountry: string, newCity: string) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (newCountry) params.set("country", newCountry);
    if (newCity.trim()) params.set("city", newCity.trim());
    router.push(`/search?${params.toString()}`);
  }

  const TABS: { key: TabKey; label: string; icon: React.ElementType; count: number }[] = [
    { key: "all", label: "All", icon: SearchIcon, count: totalCount },
    { key: "jobs", label: "Jobs", icon: Briefcase, count: results.jobs.length },
    { key: "candidates", label: "Candidates", icon: User, count: results.candidates.length },
    { key: "listings", label: "Marketplace", icon: ShoppingBag, count: results.listings.length },
    { key: "articles", label: "Learning Hub", icon: GraduationCap, count: results.articles.length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          {query ? <>Search results for &ldquo;{query}&rdquo;</> : <>Search Hunared</>}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {query
            ? `${totalCount} result${totalCount === 1 ? "" : "s"} found across jobs, candidates, marketplace, and learning hub.`
            : "Enter a search term above to find jobs, candidates, property, marketplace listings, and courses."}
        </p>
      </div>

      {/* Location filters + auto-detection + currency note */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Country dropdown */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={country}
            onChange={(e) => updateFilters(e.target.value, cityInput)}
            aria-label="Filter by country"
            className="h-9 pl-9 pr-8 rounded-full border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition appearance-none cursor-pointer"
          >
            <option value="" className="bg-background text-foreground">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-background text-foreground">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* City input — press Enter to apply */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateFilters(country, cityInput);
          }}
          className="relative"
        >
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Filter by city..."
            aria-label="Filter by city"
            className="h-9 px-3 rounded-full border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition w-40"
          />
        </form>

        {(country || city) && (
          <button
            type="button"
            onClick={() => {
              setCityInput("");
              updateFilters("", "");
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}

        {!country && !geo.loading && geo.countryCode && (
          <button
            type="button"
            onClick={() => updateFilters(geo.countryCode!, "")}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/8 text-primary hover:bg-primary/15 transition-colors"
          >
            <MapPin className="h-3 w-3" />
            Show results near {geo.city ? `${geo.city}, ` : ""}
            {geo.countryName}
          </button>
        )}

        {/* Detected currency note */}
        {!geo.loading && geo.currency && (
          <span className="text-xs text-muted-foreground ml-auto">
            Browsing from {geo.countryName} &bull; local currency {geo.currency}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {TABS.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
              tab === key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-primary/8 hover:text-primary"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            <span className="text-xs opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {/* Jobs */}
      {(tab === "all" || tab === "jobs") && results.jobs.length > 0 && (
        <Section title="Jobs" icon={Briefcase}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <p className="font-semibold text-foreground">{job.job_title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {job.company_name} &bull; {job.location}
                </p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {job.job_description}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Candidates */}
      {(tab === "all" || tab === "candidates") && results.candidates.length > 0 && (
        <Section title="Candidates" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.candidates.map((c) => (
              <Link
                key={c.id}
                href={`/candidates/${c.id}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                {c.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.avatar_url}
                    alt={c.full_name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground">{c.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.profession} &bull; {c.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Marketplace */}
      {(tab === "all" || tab === "listings") && results.listings.length > 0 && (
        <Section title="Marketplace" icon={ShoppingBag}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.listings.map((l) => (
              <Link
                key={l.id}
                href={`/market/${l.id}`}
                className="block p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <p className="font-semibold text-foreground">{l.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{l.location}</p>
                <p className="text-sm font-medium text-primary mt-1">
                  {l.currency} {l.price}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Learning Hub */}
      {(tab === "all" || tab === "articles") && results.articles.length > 0 && (
        <Section title="Learning Hub" icon={GraduationCap}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.articles.map((a) => (
              <Link
                key={a.id}
                href={`/education/${a.id}`}
                className="block p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <p className="font-semibold text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{a.content}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {query && totalCount === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No results found for &ldquo;{query}&rdquo;. Try a different keyword.</p>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        <Icon className="h-4 w-4" /> {title}
      </h2>
      {children}
    </div>
  );
}