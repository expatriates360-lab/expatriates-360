import { ShieldCheck, Search, UploadCloud, Globe, Zap, Lock } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Precision Job Search",
    description: "Filter by category, subcategory, location, and salary range to find your ideal overseas role instantly.",
  },
  {
    icon: UploadCloud,
    title: "One-Click CV Upload",
    description: "Upload your resume once. Employers can download your CV directly from your candidate profile.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Employers",
    description: "All employer accounts and job listings pass admin review before going live. Zero spam.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with companies and talent across 40+ countries in the GCC, Europe, Asia, and beyond.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built on Next.js Server Components with server-side data fetching — no loading spinners.",
  },
  {
    icon: Lock,
    title: "Data Privacy First",
    description: "Your personal data stays private. Contact info is only visible when you choose to share it.",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Why Choose Us</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="gradient-text">Built for Expats.</span>{" "}
            <span className="text-foreground">By Expats.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We understand the unique challenges of international careers. Every feature is designed to make your expat journey smoother.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
