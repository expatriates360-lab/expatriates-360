import {
  GraduationCap,
  Wrench,
  Award,
  Factory,
  Target,
  BookOpen,
  HandHeart,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

/*
 * Section 4: Hunared Program (Phase 2 spec).
 * Traffic-transfer section — introduces Hunared Organization programs
 * and redirects users to the respective Hunared.org pages.
 */

const PROGRAM_SERVICES = [
  {
    icon: GraduationCap,
    label: "Education Programs",
    href: "https://hunared.org/education-programs",
  },
  {
    icon: Wrench,
    label: "Technical Training",
    href: "https://hunared.org/technical-training",
  },
  {
    icon: Award,
    label: "International Certifications",
    href: "https://hunared.org/international-certifications",
  },
  {
    icon: Factory,
    label: "Industrial Certifications",
    href: "https://hunared.org/industrial-certifications",
  },
  {
    icon: Target,
    label: "Internships",
    href: "https://hunared.org/internships",
  },
  {
    icon: BookOpen,
    label: "Scholarships",
    href: "https://hunared.org/scholarships",
  },
  {
    icon: HandHeart,
    label: "Sponsorship Programs",
    href: "https://hunared.org/sponsorship-programs",
  },
  {
    icon: TrendingUp,
    label: "Career Development Programs",
    href: "https://hunared.org/career-development-programs",
  },
];

const HUNARED_ORG_URL = "https://hunared.org";

export function HunaredProgram() {
  return (
    <section
      className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
      aria-labelledby="hunared-program-heading"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
            Hunared Program
          </p>

          <h2
            id="hunared-program-heading"
            className="text-3xl font-bold"
          >
            Grow Your Skills with Hunared Organization
          </h2>

          <p className="text-muted-foreground mt-3">
            Education, training, certifications, and career development
            programs delivered by Hunared Organization to help you build a
            stronger future.
          </p>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PROGRAM_SERVICES.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-card text-center hover:border-primary/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-6 w-6" />
              </div>

              <p className="text-sm font-medium text-foreground">{label}</p>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={HUNARED_ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-colors"
          >
            Explore Hunared.org
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
