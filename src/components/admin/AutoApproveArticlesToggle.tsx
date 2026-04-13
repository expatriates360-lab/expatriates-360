"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AutoApproveArticlesToggleProps {
  initialValue: boolean;
}

export function AutoApproveArticlesToggle({ initialValue }: AutoApproveArticlesToggleProps) {
  const [enabled, setEnabled] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  async function handleToggle(value: boolean) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auto_approve_articles: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update setting");
      setEnabled(value);
      toast.success(
        value
          ? "Auto-approve enabled — new and edited articles will be published instantly."
          : "Auto-approve disabled — articles require manual review."
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium">Auto-Approve Incoming Articles</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          When enabled, new and edited articles are approved immediately without manual review.
        </p>
      </div>
      {saving ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
      ) : (
        <Switch
          checked={enabled}
          onCheckedChange={handleToggle}
          aria-label="Auto-approve articles"
        />
      )}
    </div>
  );
}
