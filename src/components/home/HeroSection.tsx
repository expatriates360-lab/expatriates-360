import Link from "next/link";
import { ArrowRight, Briefcase, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "12,000+", label: "Active Expats", icon: Users },
  { value: "3,500+", label: "Jobs Posted", icon: Briefcase },
  { value: "800+", label: "Companies", icon: TrendingUp },
  { value: "40+", label: "Countries", icon: ShoppingBag },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Ambient background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[var(--brand-from)] opacity-[0.08] blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full bg-[var(--brand-via)] opacity-[0.07] blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-[400px] w-[400px] rounded-full bg-[var(--brand-to)] opacity-[0.07] blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8 pt-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          The Global Expat Career &amp; Lifestyle Hub
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
          <span className="gradient-text">Your World.</span>
          <br />
          <span className="text-foreground">Your Career.</span>
          <br />
          <span className="gradient-text">360°</span>
          <span className="text-foreground"> Coverage.</span>
        </h1>

        {/* Sub-heading */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
          Whether you&apos;re searching for your next opportunity abroad or looking to hire
          world-class talent — Expatriates 360 connects people and possibilities across every timezone.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-12 px-8 text-base bg-primary hover:bg-primary/90 shadow-lg brand-glow transition-all duration-300 hover:scale-105"
            asChild
          >
            <Link href="/jobs">
              Browse Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base border-primary/30 hover:border-primary/60 hover:bg-primary/8 transition-all duration-300"
            asChild
          >
            <Link href="/candidates">Find Candidates</Link>
          </Button>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>Popular:</span>
          {["Engineering", "Safety & HSE", "Oil & Gas", "Construction", "IT"].map((tag) => (
            <Link
              key={tag}
              href={`/jobs?category=${encodeURIComponent(tag)}`}
              className="hover:text-primary transition-colors duration-200 underline underline-offset-4 decoration-dotted"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mt-20 w-full border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/50">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 py-6 px-4"
              >
                <Icon className="h-5 w-5 text-primary mb-1 opacity-70" />
                <span className="text-2xl font-bold gradient-text">{value}</span>
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
