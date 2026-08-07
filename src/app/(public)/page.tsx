import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedJobsSection } from "@/components/home/FeaturedJobsSection";
import { BrowseCategories } from "@/components/home/BrowseCategories";
import { HunaredProgram } from "@/components/home/HunaredProgram";
import { WhyUsSection } from "@/components/home/HunaredFinder";
import { CtaBanner } from "@/components/home/CtaBanner";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home — Global Jobs, Property, Marketplace & Learning",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrowseCategories />
      {/* <FeaturedJobsSection /> */}
      <HunaredProgram />
      <WhyUsSection />
      <CtaBanner />
    </>
  );
}