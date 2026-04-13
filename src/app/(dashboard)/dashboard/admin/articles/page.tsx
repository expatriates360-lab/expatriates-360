import { createAdminClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_COLORS } from "@/lib/constants";
import { ArticleModerationActions } from "@/components/admin/ArticleModerationActions";
import { AutoApproveArticlesToggle } from "@/components/admin/AutoApproveArticlesToggle";
import type { Article } from "@/types/database";

export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
  page?: string;
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createAdminClient();

  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (caller?.role !== "admin") redirect("/dashboard");

  const sp = await searchParams;

  // Fetch auto-approve setting
  let autoApproveArticles = false;
  try {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("auto_approve_articles")
      .limit(1)
      .single();
    autoApproveArticles = settings?.auto_approve_articles === true;
  } catch {
    // table row may not exist yet
  }

  const statusFilter = sp.status ?? "pending";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const limit = 15;
  const from = (page - 1) * limit;

  let articles: Article[] = [];
  let total = 0;
  let writerMap: Record<string, { full_name: string; username: string | null }> = {};

  try {
    let query = supabase
      .from("articles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter as Article["status"]);
    }

    const { data, count } = await query;
    articles = data ?? [];
    total = count ?? 0;

    // Fetch writer profiles for all articles
    const authorIds = [...new Set(articles.map((a) => a.author_id))];
    if (authorIds.length > 0) {
      const { data: writers } = await supabase
        .from("profiles")
        .select("id, full_name, username")
        .in("id", authorIds);
      if (writers) {
        for (const w of writers) {
          writerMap[w.id] = { full_name: w.full_name, username: w.username };
        }
      }
    }
  } catch {
    // empty state
  }

  const totalPages = Math.ceil(total / limit);

  // Tab counts
  let pendingCount = 0;
  let approvedCount = 0;
  try {
    const { data: allArticles } = await supabase
      .from("articles")
      .select("status");
    if (allArticles) {
      pendingCount = allArticles.filter((a) => a.status === "pending").length;
      approvedCount = allArticles.filter((a) => a.status === "approved").length;
    }
  } catch {
    // ignore
  }

  const STATUS_TABS = [
    { label: "Pending", value: "pending", count: pendingCount },
    { label: "Approved", value: "approved", count: approvedCount },
    { label: "All", value: "all", count: pendingCount + approvedCount },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Articles</h1>
        <p className="text-sm text-muted-foreground">Moderate education hub submissions</p>
      </div>

      {/* Auto-approve toggle */}
      <AutoApproveArticlesToggle initialValue={autoApproveArticles} />

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={statusFilter === tab.value ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={`/dashboard/admin/articles?status=${tab.value}`}>
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
            </Link>
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-0 pb-0 overflow-x-auto">
          {articles.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground">
                No {statusFilter !== "all" ? statusFilter : ""} articles.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => {
                  const catLabel =
                    ARTICLE_CATEGORIES.find((c) => c.value === article.category)?.label ??
                    article.category;
                  const catColor =
                    ARTICLE_CATEGORY_COLORS[article.category] ?? "bg-muted text-muted-foreground";

                  return (
                    <tr
                      key={article.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          {article.status === "approved" ? (
                            <Link
                              href={`/education/${article.id}`}
                              target="_blank"
                              className="font-medium hover:text-primary hover:underline transition-colors line-clamp-1"
                            >
                              {article.title}
                            </Link>
                          ) : (
                            <span className="font-medium line-clamp-1">{article.title}</span>
                          )}
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {article.content.slice(0, 80)}…
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`text-xs border-0 ${catColor}`}>{catLabel}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(article.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <ArticleModerationActions
                          articleId={article.id}
                          currentStatus={article.status}
                          article={article}
                          writer={writerMap[article.author_id] ?? null}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/admin/articles?status=${statusFilter}&page=${page - 1}`}>
                Previous
              </Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/admin/articles?status=${statusFilter}&page=${page + 1}`}>
                Next
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
