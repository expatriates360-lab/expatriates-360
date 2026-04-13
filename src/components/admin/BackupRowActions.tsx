"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { downloadBackup, deleteBackup } from "@/app/(dashboard)/dashboard/admin/backups/actions";

export function BackupRowActions({ fileName }: { fileName: string }) {
  const [isDownloading, startDownload] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  function handleDownload() {
    startDownload(async () => {
      try {
        const url = await downloadBackup(fileName);
        window.open(url, "_blank", "noopener,noreferrer");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Download failed");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${fileName}"? This cannot be undone.`)) return;
    startDelete(async () => {
      try {
        await deleteBackup(fileName);
        toast.success(`"${fileName}" deleted.`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Delete failed");
      }
    });
  }

  return (
    <div className="flex items-center gap-1.5 justify-end">
      <Button
        size="sm"
        variant="outline"
        className="h-7 gap-1.5 text-xs cursor-pointer"
        onClick={handleDownload}
        disabled={isDownloading || isDeleting}
      >
        {isDownloading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Download className="h-3 w-3" />
        )}
        Download
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
        onClick={handleDelete}
        disabled={isDeleting || isDownloading}
      >
        {isDeleting ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Trash2 className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
