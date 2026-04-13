"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase";
import {
  runBackup,
  deleteBackupFile,
  getSignedDownloadUrl,
  type BackupResult,
} from "@/lib/services/backupService";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (data?.role !== "admin") throw new Error("Forbidden");
}

export async function triggerManualBackup(): Promise<BackupResult> {
  await requireAdmin();
  const result = await runBackup();
  revalidatePath("/dashboard/admin/backups");
  return result;
}

export async function downloadBackup(fileName: string): Promise<string> {
  await requireAdmin();
  return getSignedDownloadUrl(fileName);
}

export async function deleteBackup(fileName: string): Promise<void> {
  await requireAdmin();
  await deleteBackupFile(fileName);
  revalidatePath("/dashboard/admin/backups");
}
