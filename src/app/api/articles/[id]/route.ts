import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";
import type { ArticleCategory, ArticleStatus } from "@/types/database";
import { ARTICLE_CATEGORIES } from "@/lib/constants";

const VALID_CATEGORIES = ARTICLE_CATEGORIES.map((c) => c.value);

async function shouldAutoApproveArticles(): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("site_settings")
      .select("auto_approve_articles")
      .limit(1)
      .single();
    return data?.auto_approve_articles === true;
  } catch {
    return false;
  }
}

/** GET /api/articles/[id]  — single article (public if approved) */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ article: data });
}

/** PATCH /api/articles/[id]
 *  - Admin:  update status (approve/reject)
 *  - Author: update title/content/category → resets status to pending (or auto-approved)
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const body: {
    status?: string;
    title?: string;
    content?: string;
    category?: string;
  } = await req.json();

  // ── Admin moderation: status change only ──────────────────────────────
  if (caller?.role === "admin" && body.status) {
    const VALID: ArticleStatus[] = ["pending", "approved"];
    if (!VALID.includes(body.status as ArticleStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const { error } = await supabase
      .from("articles")
      .update({ status: body.status as ArticleStatus })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // ── Author content edit ────────────────────────────────────────────────
  const { data: article } = await supabase
    .from("articles")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (article.author_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!body.title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!body.content?.trim()) return NextResponse.json({ error: "Content is required" }, { status: 400 });
  if (!body.category || !VALID_CATEGORIES.includes(body.category as ArticleCategory)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const autoApprove = await shouldAutoApproveArticles();

  const { error } = await supabase
    .from("articles")
    .update({
      title: body.title.trim(),
      content: body.content.trim(),
      category: body.category as ArticleCategory,
      status: autoApprove ? "approved" : "pending",
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, autoApproved: autoApprove });
}

/** DELETE /api/articles/[id]  — admin or article author */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  const { data: article } = await supabase
    .from("articles")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (article.author_id !== userId && caller?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
