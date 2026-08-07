"use client";

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
  { href: "https://www.linkedin.com/in/hunaredorganization", label: "in" },
  { href: "https://x.com/HunaredOrg", label: "𝕏" },
  { href: "https://www.facebook.com/HunaredOrganization/", label: "fb" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link
  href="/"
  className="flex items-center gap-2.5 group shrink-0 logo-premium"
  aria-label="Hunared home"
>
  <Image
    src="/assets/logos/logo-horizontal.png"
    alt="Hunared Logo"
    width={42}
    height={38}
    quality={100}
    priority
    className="h-10 w-10 object-contain"
  />

  {/* Logo Text – animation stays inside the letters */}
  <span
    className="logo-text relative text-[30px] font-extrabold tracking-tight leading-none select-none"
    style={{ fontFamily: "Inter, Poppins, sans-serif" }}
  >
    <span className="logo-text-gradient">Hunared</span>
  </span>
</Link>

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Your complete career and lifestyle portal for expatriates — connecting talent with opportunity across the globe.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full justify-between">
            <span>© {new Date().getFullYear()} Hunared. All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* Animation keyframes – now works because this is a Client Component */}
      <style jsx>{`
  /* ── Premium Logo Base ─────────────────────────────── */
  .logo-premium {
    will-change: transform;
    transition: transform 300ms ease-out;
  }

  .logo-premium:hover {
    transform: scale(1.03);
  }

  /* ── Text container ────────────────────────────────── */
  .logo-text {
    position: relative;
    display: inline-block;
  }

  /* ── Animation stays INSIDE the letters ───────────── */
  .logo-text-gradient {
    background: linear-gradient(
      115deg,
      #2ea8ff 0%,
      #356dff 22%,
      #5ef7ff 45%,
      #2a2f8f 68%,
      #7fdbff 100%
    );
    background-size: 250% 250%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: logoInsideShift 6s ease-in-out infinite;
    will-change: background-position;
  }

  /* Slightly brighter on hover (still inside letters) */
  .logo-premium:hover .logo-text-gradient {
    background: linear-gradient(
      115deg,
      #4eb8ff 0%,
      #4a7fff 22%,
      #7ef9ff 45%,
      #3a3faf 68%,
      #9fe5ff 100%
    );
    background-size: 250% 250%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    transition: background 300ms ease-out;
  }

  /* ── Smooth color movement inside the text ────────── */
  @keyframes logoInsideShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
      `}</style>
    </footer>
  );
}