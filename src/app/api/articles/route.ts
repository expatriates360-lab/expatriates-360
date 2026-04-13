import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";
import { ARTICLE_CATEGORIES } from "@/lib/constants";
import type { ArticleCategory } from "@/types/database";

const VALID_CATEGORIES = ARTICLE_CATEGORIES.map((c) => c.value);

/** Verifies a reCAPTCHA v2 token with Google's siteverify endpoint. */
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    // Skip verification when the secret is not configured (e.g., local dev without keys)
    console.warn("RECAPTCHA_SECRET_KEY is not set — skipping verification");
    return true;
  }
  const params = new URLSearchParams({ secret, response: token });
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const json = (await res.json()) as { success: boolean; "error-codes"?: string[] };
  return json.success === true;
}

/** GET /api/articles?category=&page=  — public listing of approved articles */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 12;
  const from = (page - 1) * limit;

  const supabase = createAdminClient();

  let query = supabase
    .from("articles")
    .select("id, title, category, author_id, created_at, content", { count: "exact" })
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (category && VALID_CATEGORIES.includes(category as ArticleCategory)) {
    query = query.eq("category", category as ArticleCategory);
  }

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ articles: data ?? [], total: count ?? 0 });
}

/** Checks the auto_approve_articles site setting. */
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

/** POST /api/articles  — authenticated users submit an article for moderation */
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: { title?: string; content?: string; category?: string; recaptchaToken?: string } = await req.json();

  // ── reCAPTCHA verification (must pass before any DB work) ──
  const tokenOk = await verifyRecaptcha(body.recaptchaToken ?? "");
  if (!tokenOk) {
    return NextResponse.json({ error: "reCAPTCHA verification failed. Please try again." }, { status: 400 });
  }

  if (!body.title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!body.content?.trim()) return NextResponse.json({ error: "Content is required" }, { status: 400 });
  if (!body.category || !VALID_CATEGORIES.includes(body.category as ArticleCategory)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const autoApprove = await shouldAutoApproveArticles();

  const { data, error } = await supabase
    .from("articles")
    .insert({
      author_id: userId,
      title: body.title.trim(),
      content: body.content.trim(),
      category: body.category as ArticleCategory,
      status: autoApprove ? "approved" : "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ article: data, autoApproved: autoApprove }, { status: 201 });
}
