import { createAdminClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DatabaseBackup, FileJson } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TriggerBackupButton } from "@/components/admin/TriggerBackupButton";
import { BackupRowActions } from "@/components/admin/BackupRowActions";
import { listBackups } from "@/lib/services/backupService";

export const dynamic = "force-dynamic";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default async function AdminBackupsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createAdminClient();
  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (caller?.role !== "admin") redirect("/dashboard");

  let backups: Awaited<ReturnType<typeof listBackups>> = [];
  let fetchError: string | null = null;

  try {
    backups = await listBackups();
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load backups";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <DatabaseBackup className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Database Backups</h1>
            <p className="text-xs text-muted-foreground">
              JSON snapshots of all core tables. Up to 3 backups retained automatically.
            </p>
          </div>
        </div>
        <TriggerBackupButton />
      </div>

      {/* Info strip */}
      <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 px-4 py-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <DatabaseBackup className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <span>
          Backups are stored privately in Supabase Storage. Download links expire after{" "}
          <strong>1 hour</strong>. Monthly automation runs on the 1st via a cron job.
        </span>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {fetchError}
          <p className="text-xs mt-1 opacity-70">
            Make sure the <code>database_backups</code> storage bucket exists in Supabase.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!fetchError && backups.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground space-y-2">
          <FileJson className="h-8 w-8 mx-auto opacity-30" />
          <p className="text-sm font-medium">No backups yet</p>
          <p className="text-xs">Click &ldquo;Generate Manual Backup&rdquo; to create your first snapshot.</p>
        </div>
      )}

      {/* Backups list */}
      {backups.length > 0 && (
        <div className="rounded-xl border overflow-hidden divide-y">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground">
            <span>File Name</span>
            <span className="hidden sm:block">Created</span>
            <span>Size</span>
            <span className="text-right">Actions</span>
          </div>
          {backups.map((file, idx) => (
            <div
              key={file.name}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 items-center text-sm"
            >
              {/* Name */}
              <div className="flex items-center gap-2 min-w-0">
                <FileJson className="h-4 w-4 text-primary shrink-0" />
                <span className="font-mono text-xs truncate">{file.name}</span>
                {idx === 0 && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-[10px] shrink-0">
                    Latest
                  </Badge>
                )}
              </div>
              {/* Date */}
              <span className="hidden sm:block text-xs text-muted-foreground whitespace-nowrap">
                {new Date(file.created_at).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {/* Size */}
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatBytes(file.size)}
              </span>
              {/* Actions */}
              <BackupRowActions fileName={file.name} />
            </div>
          ))}
        </div>
      )}

      {/* Cron setup guide */}
      <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Monthly Automation Endpoint
        </p>
        <code className="block text-xs bg-muted rounded px-2 py-1.5 break-all">
          POST /api/cron/backup
          {" — "}Authorization: Bearer {"<CRON_SECRET>"}
        </code>
        <p className="text-xs text-muted-foreground">
          Use GitHub Actions, Vercel Cron, or any web cron service to hit this endpoint on the 1st of every month.
        </p>
      </div>
    </div>
  );
}
