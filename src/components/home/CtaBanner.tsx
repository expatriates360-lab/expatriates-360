import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-card border border-primary/20 brand-glow p-10 md:p-16 text-center">
          {/* Background decoration */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-10 -right-10 h-60 w-60 rounded-full bg-[var(--brand-from)] opacity-[0.06] blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-[var(--brand-via)] opacity-[0.06] blur-3xl" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Ready to Take the Next Step?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg mb-8">
            Join thousands of expat professionals who found their dream role or perfect hire through Expatriates 360.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/register">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base border-primary/30 hover:border-primary/60"
              asChild
            >
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
