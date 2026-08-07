"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  ChevronDown,
  Smartphone,
  Laptop,
  Watch,
  Gem,
  Wallet,
  CreditCard,
  FileText,
  Key,
  Car,
  Bike,
  Backpack,
  PawPrint,
  User,
  Package,
  Briefcase,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { icon: Smartphone, label: "Mobile Phones", count: 128 },
  { icon: Laptop, label: "Laptops", count: 64 },
  { icon: Watch, label: "Watches", count: 41 },
  { icon: Gem, label: "Jewelry", count: 37 },
  { icon: Wallet, label: "Wallets", count: 89 },
  { icon: CreditCard, label: "Cards", count: 52 },
  { icon: FileText, label: "Passport / Docs", count: 73 },
  { icon: Key, label: "Keys", count: 95 },
  { icon: Car, label: "Vehicles", count: 22 },
  { icon: Bike, label: "Bicycles", count: 18 },
  { icon: Backpack, label: "Bags", count: 56 },
  { icon: PawPrint, label: "Pets", count: 31 },
  { icon: User, label: "Missing Persons", count: 9 },
  { icon: Package, label: "Packages", count: 27 },
  { icon: Briefcase, label: "Business Equip.", count: 15 },
  { icon: GraduationCap, label: "Student Items", count: 44 },
  { icon: MoreHorizontal, label: "Other", count: 61 },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "lost", label: "Lost" },
  { value: "found", label: "Found" },
];

const SAMPLE_LISTINGS = [
  {
    id: 1,
    title: "iPhone 15 Pro – Blue Titanium",
    status: "lost",
    category: "Mobile Phones",
    city: "Riyadh",
    country: "Saudi Arabia",
    date: "2 days ago",
    reward: "SAR 500",
  },
  {
    id: 2,
    title: "Black Leather Wallet with Cards",
    status: "found",
    category: "Wallets",
    city: "Dubai",
    country: "UAE",
    date: "1 day ago",
    reward: null,
  },
  {
    id: 3,
    title: "Passport – Pakistani National",
    status: "found",
    category: "Passport / Docs",
    city: "Jeddah",
    country: "Saudi Arabia",
    date: "5 hours ago",
    reward: null,
  },
  {
    id: 4,
    title: "Silver Rolex Watch",
    status: "lost",
    category: "Watches",
    city: "Doha",
    country: "Qatar",
    date: "3 days ago",
    reward: "QAR 1000",
  },
];

export function WhyUsSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");

  function handleSearch(e?: FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (category) params.set("category", category);
    if (country) params.set("country", country);
    if (status) params.set("status", status);
    // For now redirect to a future finder page (or search)
    router.push(`/search?${params.toString()}&type=finder`);
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* soft background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[#2EA8FF]/[0.05] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">
            🌍 Community Service
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#2EA8FF] via-[#5EF7FF] to-[#356DFF] bg-clip-text text-transparent">
              Hunared Finder
            </span>
          </h2>
          <p className="text-lg font-medium text-foreground">
            Helping People Find What Matters.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Lost something? Found an item? Let the Hunared community help reconnect people with their valuables through a secure, verified, and location-based Lost &amp; Found platform.
          </p>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 sm:p-5 space-y-4 shadow-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search lost or found items..."
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-white/10 bg-white/[0.05] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2EA8FF]/40"
              />
            </div>

            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 pl-3 pr-8 rounded-xl border border-white/10 bg-white/[0.05] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#2EA8FF]/40 cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-11 pl-9 pr-8 rounded-xl border border-white/10 bg-white/[0.05] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#2EA8FF]/40 cursor-pointer"
              >
                <option value="">All Countries</option>
                {COUNTRIES.slice(0, 60).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-11 pl-3 pr-8 rounded-xl border border-white/10 bg-white/[0.05] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#2EA8FF]/40 cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 h-11 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-[#2EA8FF] via-[#356DFF] to-[#5B3FFF] hover:scale-[1.02] transition-all duration-300"
          >
            Search Listings
          </button>
        </form>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-in"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 h-12 rounded-full font-semibold text-sm text-white bg-red-600 hover:bg-red-500 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-red-900/30"
          >
            🔴 Report Lost Item
          </Link>
          <Link
            href="/sign-in"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 h-12 rounded-full font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-emerald-900/30"
          >
            🟢 Report Found Item
          </Link>
        </div>

        {/* Categories grid */}
        <div>
          <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            Featured Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.map(({ icon: Icon, label, count }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setCategory(label);
                  handleSearch();
                }}
                className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-[#2EA8FF]/40 hover:bg-[#2EA8FF]/[0.06] transition-all duration-200"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {label}
                </span>
                <span className="text-[10px] text-muted-foreground">{count} active</span>
              </button>
            ))}
          </div>
        </div>

        {/* Latest listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Latest Community Listings
            </h3>
            <Link
              href="/search?type=finder"
              className="text-sm text-primary hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_LISTINGS.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-primary/30 hover:shadow-md transition-all duration-300 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      item.status === "lost"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-emerald-500/15 text-emerald-400"
                    )}
                  >
                    {item.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">{item.category}</p>
                  <h4 className="text-sm font-semibold text-foreground line-clamp-2">
                    {item.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {item.city}, {item.country}
                </div>

                {item.reward && (
                  <p className="text-xs font-medium text-amber-400">
                    Reward: {item.reward}
                  </p>
                )}

                <Link
                  href="/sign-in"
                  className="block w-full text-center text-xs font-medium py-2 rounded-lg border border-white/10 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}