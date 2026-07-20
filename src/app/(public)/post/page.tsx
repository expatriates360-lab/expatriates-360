"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  Briefcase, Zap, GraduationCap, Wrench, Home, ShoppingBag, Megaphone,
  CalendarDays, Users, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Create Ad — public chooser page (Phase 2, Section 2).
 * Visible to everyone; login is required only when publishing.
 * Signed-out users are sent to /sign-in with a redirect back to the form.
 */

type AdType = {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string | null; // null = coming soon
  examples: string[];
};

const AD_TYPES: AdType[] = [
  {
    icon: Briefcase,
    title: "Jobs",
    description: "Post permanent job openings and reach global talent.",
    href: "/dashboard/jobs/new",
    examples: ["Engineering", "Construction", "Healthcare", "IT"],
  },
  {
    icon: Zap,
    title: "Temp Work & Task Force",
    description: "Hire temporary workers, skilled trades, and general labor fast.",
    href: "/dashboard/jobs/new",
    examples: ["Temp Jobs", "Task Force", "Skilled Workers", "General Labor"],
  },
  {
    icon: GraduationCap,
    title: "Learning Hub",
    description: "Share courses, certifications, internships, and scholarships.",
    href: "/dashboard/articles/new",
    examples: ["Courses", "Certifications", "Internships", "Scholarships"],
  },
  {
    icon: Wrench,
    title: "Services",
    description: "Offer professional, construction, IT, design, and more.",
    href: "/dashboard/market/new?category=services",
    examples: ["Electrical", "IT Services", "Logistics", "Design"],
  },
  {
    icon: Home,
    title: "Property",
    description: "List houses, apartments, rooms, bed spaces, and commercial units.",
    href: "/dashboard/market/new?category=accommodation",
    examples: ["Houses for Rent", "Rooms & Bed Spaces", "Offices", "Land"],
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "Sell vehicles, electronics, furniture, tools, and more.",
    href: "/dashboard/market/new",
    examples: ["Vehicles", "Electronics", "Furniture", "Appliances"],
  },
  {
    icon: Megaphone,
    title: "Articles & News",
    description: "Publish articles and community news for the Hunared audience.",
    href: "/dashboard/articles/new",
    examples: ["Articles", "News", "Career Tips", "Safety & HSE"],
  },
  {
    icon: CalendarDays,
    title: "Events",
    description: "Promote community events and gatherings.",
    href: null,
    examples: ["Meetups", "Job Fairs", "Workshops"],
  },
  {
    icon: Users,
    title: "Networking",
    description: "Connect professionals and build community groups.",
    href: null,
    examples: ["Professional Groups", "Communities"],
  },
];

export default function CreateAdPage() {
  const { isSignedIn } = useAuth();

  function hrefFor(type: AdType): string {
    if (!type.href) return "#";
    if (isSignedIn) return type.href;
    // Signed-out: go to sign-in, then bounce back to the intended form
    return `/sign-in?redirect_url=${encodeURIComponent(type.href)}`;
  }

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 py-24 mt-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold">Create an Ad</h1>
          <p className="text-muted-foreground mt-2">
            Choose what you want to post. Anyone can browse — you&apos;ll be asked
            to sign in before publishing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AD_TYPES.map((type) => {
            const Icon = type.icon;
            const comingSoon = !type.href;
            const card = (
              <div
                className={cn(
                  "h-full p-5 rounded-2xl border transition-all duration-200 flex flex-col gap-3",
                  comingSoon
                    ? "border-border/60 bg-muted/30 opacity-70 cursor-not-allowed"
                    : "border-border bg-card hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  {comingSoon ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      Coming Soon
                    </span>
                  ) : (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{type.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {type.examples.map((ex) => (
                    <span
                      key={ex}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            );

            return comingSoon ? (
              <div key={type.title}>{card}</div>
            ) : (
              <Link key={type.title} href={hrefFor(type)}>
                {card}
              </Link>
            );
          })}
        </div>

        {!isSignedIn && (
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Register free
            </Link>{" "}
            — it takes under a minute.
          </p>
        )}
      </div>
    </main>
  );
}
