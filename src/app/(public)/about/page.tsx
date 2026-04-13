import type { Metadata } from "next";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { Globe, Users, Briefcase, BookOpen, ShoppingBag, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Expatriates 360 — the complete 360° portal built to empower expats with jobs, community, marketplace, and education worldwide.",
};

const features = [
  {
    icon: Briefcase,
    title: "Global Job Board",
    description:
      "Thousands of verified international opportunities, from entry-level to executive, across 50+ countries.",
  },
  {
    icon: Users,
    title: "Candidate Directory",
    description:
      "A living pool of talent ready to relocate. Employers discover candidates; professionals get discovered.",
  },
  {
    icon: ShoppingBag,
    title: "Expat Marketplace",
    description:
      "Buy, sell, or advertise services within the expat community — from accommodation to electronics.",
  },
  {
    icon: BookOpen,
    title: "Education Hub",
    description:
      "Practical articles, guides, and insights written by expats, for expats. Knowledge that travels with you.",
  },
  {
    icon: Globe,
    title: "Global Community",
    description:
      "Connect with a network of professionals who understand the expat journey firsthand.",
  },
  {
    icon: Star,
    title: "Trusted Platform",
    description:
      "Human-reviewed listings and a moderation system that keeps every interaction safe and professional.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/10 via-background to-background py-24 sm:py-32">
        {/* decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
        />
        <SiteContainer className="relative text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <Globe className="h-3.5 w-3.5" />
            Built for the Global Expat
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Your Complete{" "}
            <span className="gradient-text">360° Platform</span>
            <br className="hidden sm:block" /> for Expat Life
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Expatriates 360 brings together everything an expat needs — career
            opportunities, community, marketplace, and knowledge — under one
            trusted roof.
          </p>
        </SiteContainer>
      </section>

      {/* ── Our Mission ───────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <SiteContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* text */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                Our Mission
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 leading-snug">
                Empowering expats to{" "}
                <span className="gradient-text">thrive anywhere</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Moving abroad is one of life&apos;s boldest decisions. Yet for
                  millions of expatriates, the journey is fragmented — job
                  boards scattered across dozens of sites, community groups
                  buried in social feeds, and crucial advice hidden behind
                  paywalls.
                </p>
                <p>
                  Expatriates 360 was founded to change that. We built a single,
                  beautifully integrated space where every expat — whether fresh
                  off the plane or decades into their international career — can
                  find work, build connections, buy and sell, and grow.
                </p>
                <p>
                  Our team is itself globally distributed, so we understand the
                  real challenges you face. Every feature we ship is guided by
                  one question: does this make expat life easier?
                </p>
              </div>
            </div>

            {/* stats card */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "50+", label: "Countries" },
                { value: "10K+", label: "Job Listings" },
                { value: "5K+", label: "Active Members" },
                { value: "360°", label: "Full Coverage" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-card p-6 text-center hover:border-primary/30 hover:shadow-md transition-all duration-200"
                >
                  <p className="text-3xl font-bold gradient-text mb-1">
                    {value}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SiteContainer>
      </section>

      {/* ── Why Choose Expatriates 360 ────────────────────────── */}
      <section className="py-20 sm:py-28 bg-muted/30 border-y border-border">
        <SiteContainer>
          <div className="text-center mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Why Choose Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need,{" "}
              <span className="gradient-text">in one place</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Six pillars that make Expatriates 360 the most complete expat
              platform on the web.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <SiteContainer className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to start your{" "}
            <span className="gradient-text">expat journey?</span>
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground mb-8">
            Join thousands of expats who found their next opportunity through
            Expatriates 360.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Browse Jobs
            </a>
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:border-primary/40 transition-colors"
            >
              Create Account
            </a>
          </div>
        </SiteContainer>
      </section>
    </div>
  );
}
