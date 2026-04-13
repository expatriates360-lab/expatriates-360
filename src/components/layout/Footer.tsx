import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  Portal: [
    { href: "/jobs", label: "Browse Jobs" },
    { href: "/candidates", label: "Find Candidates" },
    { href: "/market", label: "Marketplace" },
    { href: "/about", label: "About Us" },
  ],
  Resources: [
    { href: "/education", label: "Education Hub" },
    { href: "/education/safety-hse", label: "Safety & HSE" },
    { href: "/education/engineering", label: "Engineering" },
    { href: "/education/career-tips", label: "Career Tips" },
  ],
  Company: [
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

const SOCIAL_LINKS = [
  { href: "#", label: "in" },
  { href: "#", label: "𝕏" },
  { href: "#", label: "fb" },
  { href: "#", label: "ig" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <Image
                src="/assets/logo new.png"
                alt="Expatriates 360"
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Your complete career and lifestyle portal for expatriates — connecting talent with opportunity across the globe.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground text-xs font-bold hover:text-primary hover:border-primary/50 hover:bg-primary/8 transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Expatriates 360. All rights reserved.</p>
          <p>
            Built for expats,{" "}
            <span className="gradient-text font-medium">by expats</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
