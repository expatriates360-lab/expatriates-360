import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedJobsSection } from "@/components/home/FeaturedJobsSection";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { FeaturedCandidatesSection } from "@/components/home/FeaturedCandidatesSection";
import { CtaBanner } from "@/components/home/CtaBanner";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home — Your Global Expat Career Hub",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedJobsSection />
      <WhyUsSection />
      <FeaturedCandidatesSection />
      <CtaBanner />
    </>
  );
}
