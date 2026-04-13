import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      {/* Ambient blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[var(--brand-from)] opacity-[0.07] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[var(--brand-via)] opacity-[0.06] blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your Expatriates 360 account</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-border rounded-2xl bg-card p-6",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "border border-border bg-background hover:bg-muted text-foreground transition-colors",
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground h-10 rounded-lg font-medium",
              formFieldInput:
                "border-border bg-background text-foreground rounded-lg h-10 focus:ring-2 focus:ring-primary/30",
              footerActionLink: "text-primary hover:underline",
            },
          }}
        />
      </div>
    </div>
  );
}
