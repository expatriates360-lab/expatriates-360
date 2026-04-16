"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { DatabaseBackup, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { triggerManualBackup } from "@/app/(dashboard)/dashboard/admin/backups/actions";

export function TriggerBackupButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const toastId = toast.loading("Running backup - this may take a moment...");
      try {
        const result = await triggerManualBackup();
        if (result.success) {
          toast.success(`Backup complete: ${result.fileName}`, { id: toastId });
        } else {
          toast.error(`Backup failed: ${result.error ?? "Unknown error"}`, {
            id: toastId,
          });
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Backup failed", {
          id: toastId,
        });
      }
    });
  }

  return (
    <Button
      className="gap-2 cursor-pointer"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <DatabaseBackup className="h-4 w-4" />
      )}
      {isPending ? "Generating..." : "Generate Manual Backup"}
    </Button>
  );
}
