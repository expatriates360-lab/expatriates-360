"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, Sparkles } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { useGeoDetection } from "@/hooks/useGeoDetection";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "jobs", label: "Jobs" },
  { value: "marketplace", label: "Marketplace" },
  { value: "companies", label: "Companies" },
  { value: "services", label: "Services" },
  { value: "courses", label: "Courses" },
  { value: "scholarships", label: "Scholarships" },
  { value: "freelancers", label: "Freelancers" },
  { value: "properties", label: "Properties" },
  { value: "events", label: "Events" },
  { value: "articles", label: "Articles" },
  { value: "people", label: "People / CVs" },
];

const POPULAR_CHIPS = [
  "Jobs",
  "Companies",
  "Marketplace",
  "Services",
  "Scholarships",
  "Courses",
  "Remote Jobs",
  "Oil & Gas",
  "Engineering",
  "Construction",
  "Healthcare",
  "IT",
];

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  SA: ["Riyadh", "Jeddah", "Dammam", "Jubail", "Khobar", "Makkah", "Madinah", "Yanbu", "Abha", "Tabuk"],
  AE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Al Ain"],
  QA: ["Doha", "Al Rayyan", "Al Wakrah", "Lusail"],
  KW: ["Kuwait City", "Hawalli", "Salmiya", "Jahra", "Ahmadi"],
  OM: ["Muscat", "Salalah", "Sohar", "Nizwa"],
  BH: ["Manama", "Riffa", "Muharraq", "Hamad Town"],
  PK: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar"],
  IN: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata"],
  EG: ["Cairo", "Alexandria", "Giza", "Sharm El Sheikh"],
  JO: ["Amman", "Irbid", "Zarqa", "Aqaba"],
  GB: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow"],
  US: ["New York", "Houston", "Los Angeles", "Chicago", "Dallas"],
  PH: ["Manila", "Cebu", "Davao", "Quezon City"],
  BD: ["Dhaka", "Chittagong", "Khulna", "Sylhet"],
  NP: ["Kathmandu", "Pokhara", "Lalitpur"],
};

const FLAG: Record<string, string> = {
  SA: "🇸🇦",
  AE: "🇦🇪",
  QA: "🇶🇦",
  KW: "🇰🇼",
  OM: "🇴🇲",
  BH: "🇧🇭",
  PK: "🇵🇰",
  IN: "🇮🇳",
  EG: "🇪🇬",
  JO: "🇯🇴",
  GB: "🇬🇧",
  US: "🇺🇸",
  PH: "🇵🇭",
  BD: "🇧🇩",
  NP: "🇳🇵",
};

export function HeroSection() {
  const router = useRouter();
  const geo = useGeoDetection();

  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (geo.countryCode && !country) {
      setCountry(geo.countryCode);
    }
    if (geo.city && !city) {
      setCity(geo.city);
    }
  }, [geo.countryCode, geo.city]);

  const cities = country ? CITIES_BY_COUNTRY[country] ?? [] : [];

  function handleSearch(e?: FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (country) params.set("country", country);
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    router.push(`/search?${params.toString()}`);
  }

  function handleChip(term: string) {
    setQuery(term);
    const params = new URLSearchParams();
    params.set("q", term);
    if (country) params.set("country", country);
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1225] to-background" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-[#2EA8FF]/[0.07] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[400px] rounded-full bg-[#356DFF]/[0.06] blur-[100px]" />
      </div>

      <div
        className={cn(
          "mx-auto w-full max-w-3xl px-4 sm:px-6 text-center space-y-8 transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Universal Smart Search
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            One Search.{" "}
            <span className="bg-gradient-to-r from-[#2EA8FF] via-[#5EF7FF] to-[#356DFF] bg-clip-text text-transparent">
              Endless Opportunities.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Search jobs, companies, marketplace, services, courses, scholarships, events, professionals and more from one intelligent box.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/40 p-4 sm:p-5 space-y-4 search-panel"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, companies, products, services, people, courses, events..."
              className="w-full h-14 pl-12 pr-4 rounded-xl border border-white/10 bg-white/[0.06] text-foreground text-base placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#2EA8FF]/50 focus:border-[#2EA8FF]/40 transition"
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCity("");
                }}
                className="w-full h-11 pl-9 pr-8 rounded-xl border border-white/10 bg-white/[0.06] text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-[#2EA8FF]/40 cursor-pointer"
              >
                <option value="">All Countries</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {(FLAG[c.code] ? FLAG[c.code] + " " : "") + c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!country || cities.length === 0}
                className="w-full h-11 pl-3 pr-8 rounded-xl border border-white/10 bg-white/[0.06] text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-[#2EA8FF]/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!country ? "Select country first" : cities.length === 0 ? "Any city" : "All Cities"}
                </option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 pl-3 pr-8 rounded-xl border border-white/10 bg-white/[0.06] text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-[#2EA8FF]/40 cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-full font-semibold text-white text-sm sm:text-base bg-gradient-to-r from-[#2EA8FF] via-[#356DFF] to-[#5B3FFF] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 ease-out"
          >
            Search Everything
          </button>
        </form>

        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Popular Searches
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {POPULAR_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChip(chip)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/[0.04] text-muted-foreground hover:border-[#2EA8FF]/40 hover:text-[#2EA8FF] hover:bg-[#2EA8FF]/10 transition-all duration-200"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .search-panel {
          animation: panelGlow 7s ease-in-out infinite;
        }
        @keyframes panelGlow {
          0%,
          100% {
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 50px rgba(0, 0, 0, 0.4);
          }
          50% {
            box-shadow: 0 0 0 1px rgba(46, 168, 255, 0.25), 0 20px 50px rgba(0, 0, 0, 0.4),
              0 0 40px rgba(46, 168, 255, 0.12);
          }
        }
      `}</style>
    </section>
  );
}