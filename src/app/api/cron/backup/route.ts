import { type NextRequest, NextResponse } from "next/server";
import { runBackup } from "@/lib/services/backupService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // ── Verify secret ─────────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Run backup ────────────────────────────────────────────────────────────
  const result = await runBackup();

  if (!result.success) {
    return NextResponse.json(
      { error: result.error ?? "Backup failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    fileName: result.fileName,
    signedUrl: result.signedUrl,
    emailStatus: result.emailError ? `FAILED: ${result.emailError}` : "sent",
  });
}
