// src/components/jobs/SaveJobButton.tsx
"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SaveJobButton({
  jobId,
  initialSaved = false,
}: {
  jobId: string;
  initialSaved?: boolean;
}) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  // Sync if parent re-renders with fresh data
  useEffect(() => setSaved(initialSaved), [initialSaved]);

  async function toggle() {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/saved-jobs", {
        method: saved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSaved(!saved);
      toast.success(saved ? "Removed from saved jobs" : "Job saved!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={saved ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      disabled={loading}
      className="gap-1.5 cursor-pointer"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {saved ? "Saved" : "Save Job"}
    </Button>
  );
}
