import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Static placeholders — replaced with Supabase queries in step 5
const FEATURED_CANDIDATES = [
  { id: "1", name: "Ahmed Al-Rashidi", profession: "Senior HSE Engineer", location: "Available – KSA/UAE", initials: "AA", color: "from-blue-500 to-cyan-500" },
  { id: "2", name: "Maria Santos", profession: "Civil Engineer", location: "Available – GCC", initials: "MS", color: "from-violet-500 to-purple-500" },
  { id: "3", name: "James Okafor", profession: "Project Manager", location: "Available – Worldwide", initials: "JO", color: "from-orange-500 to-red-500" },
  { id: "4", name: "Li Wei", profession: "Electrical Engineer", location: "Available – Middle East", initials: "LW", color: "from-green-500 to-emerald-500" },
];

export function FeaturedCandidatesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Talent</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="gradient-text">Our Candidates</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Skilled expat professionals ready for their next international assignment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_CANDIDATES.map((candidate) => (
            <div
              key={candidate.id}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center"
            >
              {/* Avatar */}
              <div className="relative mb-4">
                <div
                  className={`h-20 w-20 rounded-full bg-gradient-to-br ${candidate.color} flex items-center justify-center text-white font-bold text-xl shadow-md`}
                >
                  {candidate.initials}
                </div>
                {/* Active dot */}
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-card" />
              </div>

              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                {candidate.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">{candidate.profession}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {candidate.location}
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full text-xs group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 py-4"
                asChild
              >
                <Link href={`/candidates/${candidate.id}`}>View Short CV</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary" asChild>
            <Link href="/candidates">
              View All Candidates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
