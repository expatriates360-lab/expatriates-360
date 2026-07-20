"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card"; // You already have shadcn
import { CREATE_AD_CATEGORIES } from "@/lib/create-ad-categories";

export function CreateAdSection() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleCardClick = (href: string) => {
    if (!isSignedIn) {
      // Requirement: "Login required before publishing"
      router.push(`/sign-in?redirect_url=${encodeURIComponent(href)}`);
      return;
    }
    router.push(href);
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Create an Ad</h2>
        <p className="text-center text-muted-foreground mb-8">
          Choose a category to get started. {!isSignedIn && "🔒 Login required to publish."}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {CREATE_AD_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card
                key={cat.id}
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-border/50 group"
                onClick={() => handleCardClick(cat.href)}
              >
                <CardContent className="flex flex-col items-center justify-center p-4 text-center space-y-2 min-h-[120px]">
                  <div className="h-12 w-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition flex items-center justify-center text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-sm">{cat.label}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Visible to everyone. Login required to publish.
        </p>
      </div>
    </section>
  );
}