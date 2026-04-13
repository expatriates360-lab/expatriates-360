import nodemailer from "nodemailer";
import { createAdminClient } from "@/lib/supabase";

const BACKUP_BUCKET = "database_backups";
const MAX_BACKUPS = 3;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BackupResult {
  success: boolean;
  fileName: string;
  signedUrl?: string;
  error?: string;
}

export interface BackupFile {
  name: string;
  created_at: string;
  size: number;
  id: string | null;
}

// ─── Main export: run a full backup ──────────────────────────────────────────

export async function runBackup(): Promise<BackupResult> {
  const fileName = `backup-${new Date().toISOString().slice(0, 10)}.json`;

  try {
    const supabase = createAdminClient();

    // ── 1. Fetch all core tables ──────────────────────────────────────────────
    const [
      { data: profiles },
      { data: jobs },
      { data: marketplace_listings },
      { data: orders },
      { data: articles },
      { data: ad_placements },
      { data: site_settings },
    ] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("jobs").select("*"),
      supabase.from("marketplace_listings").select("*"),
      supabase.from("orders").select("*"),
      supabase.from("articles").select("*"),
      supabase.from("ad_placements").select("*"),
      supabase.from("site_settings").select("*"),
    ]);

    const payload = {
      exported_at: new Date().toISOString(),
      tables: {
        profiles: profiles ?? [],
        jobs: jobs ?? [],
        marketplace_listings: marketplace_listings ?? [],
        orders: orders ?? [],
        articles: articles ?? [],
        ad_placements: ad_placements ?? [],
        site_settings: site_settings ?? [],
      },
    };

    const json = JSON.stringify(payload, null, 2);
    const buffer = Buffer.from(json, "utf-8");

    // ── 2. Upload to Supabase Storage ─────────────────────────────────────────
    const { error: uploadError } = await supabase.storage
      .from(BACKUP_BUCKET)
      .upload(fileName, buffer, {
        contentType: "application/json",
        upsert: true,
      });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    // ── 3. Retention: keep only the 3 most recent backups ────────────────────
    const { data: files } = await supabase.storage
      .from(BACKUP_BUCKET)
      .list("", { sortBy: { column: "created_at", order: "asc" } });

    if (files && files.length > MAX_BACKUPS) {
      const toDelete = files
        .slice(0, files.length - MAX_BACKUPS)
        .map((f) => f.name);
      await supabase.storage.from(BACKUP_BUCKET).remove(toDelete);
    }

    // ── 4. Generate a temporary signed URL (24 h) ─────────────────────────────
    const { data: urlData } = await supabase.storage
      .from(BACKUP_BUCKET)
      .createSignedUrl(fileName, 60 * 60 * 24);

    const signedUrl = urlData?.signedUrl;

    // ── 5. Send notification email ────────────────────────────────────────────
    await sendBackupEmail(fileName, signedUrl, buffer);

    return { success: true, fileName, signedUrl };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[backupService] Error:", message);
    return { success: false, fileName, error: message };
  }
}

// ─── Email helper ─────────────────────────────────────────────────────────────

async function sendBackupEmail(
  fileName: string,
  signedUrl: string | undefined,
  attachment: Buffer
): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, BACKUP_EMAIL_TO } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !BACKUP_EMAIL_TO) {
    console.warn("[backupService] SMTP env vars missing — skipping email.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: Number(SMTP_PORT ?? 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const downloadLine = signedUrl
    ? `<p><a href="${signedUrl}">Download backup (link valid 24 hours)</a></p>`
    : "";

  await transporter.sendMail({
    from: `"Expatriates 360 Backups" <${SMTP_USER}>`,
    to: BACKUP_EMAIL_TO,
    subject: `✅ Database backup complete — ${fileName}`,
    html: `
      <h2>Database Backup Successful</h2>
      <p>A new JSON snapshot was saved: <strong>${fileName}</strong></p>
      ${downloadLine}
      <p>The backup contains: profiles, jobs, marketplace listings, orders, articles, ad placements, and site settings.</p>
      <p style="color:#888;font-size:12px">Expatriates 360 automated backup system</p>
    `,
    attachments: [
      {
        filename: fileName,
        content: attachment,
        contentType: "application/json",
      },
    ],
  });
}

// ─── Storage helpers (used by admin UI) ──────────────────────────────────────

export async function listBackups(): Promise<BackupFile[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(BACKUP_BUCKET)
    .list("", { sortBy: { column: "created_at", order: "desc" } });
  if (error) throw new Error(error.message);
  return (data ?? []).map((f) => ({
    name: f.name,
    created_at: f.created_at ?? new Date(0).toISOString(),
    size: f.metadata?.size ?? 0,
    id: f.id ?? null,
  }));
}

export async function getSignedDownloadUrl(fileName: string): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(BACKUP_BUCKET)
    .createSignedUrl(fileName, 60 * 60); // 1-hour link
  if (error || !data?.signedUrl) throw new Error(error?.message ?? "Failed to create URL");
  return data.signedUrl;
}

export async function deleteBackupFile(fileName: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(BACKUP_BUCKET)
    .remove([fileName]);
  if (error) throw new Error(error.message);
}
