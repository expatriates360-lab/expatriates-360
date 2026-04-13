"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface JobModerationActionsProps {
  jobId: string;
  currentStatus: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

export function JobModerationActions({ jobId, currentStatus }: JobModerationActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function updateStatus(newStatus: "approved" | "rejected") {
    setLoading(newStatus === "approved" ? "approve" : "reject");
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStatus(newStatus);
      toast.success(`Job ${newStatus}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Badge className={`text-xs border ${STATUS_COLORS[status] ?? ""}`}>
        {status}
      </Badge>
      {status !== "approved" && (
        <Button
          size="sm"
          className="h-7 text-xs px-2 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => updateStatus("approved")}
          disabled={loading !== null}
        >
          {loading === "approve" ? "…" : "Approve"}
        </Button>
      )}
      {status !== "rejected" && (
        <Button
          variant="destructive"
          size="sm"
          className="h-7 text-xs px-2"
          onClick={() => updateStatus("rejected")}
          disabled={loading !== null}
        >
          {loading === "reject" ? "…" : "Reject"}
        </Button>
      )}
    </div>
  );
}
