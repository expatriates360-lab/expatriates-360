import { createAdminClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Plus, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_COLORS } from "@/lib/constants";
import type { Article } from "@/types/database";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
};

export default async function MyArticlesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let articles: Article[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("author_id", userId)
      .order("created_at", { ascending: false });
    articles = data ?? [];
  } catch {
    // empty state
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Articles</h1>
          <p className="text-sm text-muted-foreground">{articles.length} article{articles.length !== 1 ? "s" : ""} submitted</p>
        </div>
        <Button asChild className="gap-1.5">
          <Link href="/dashboard/articles/new">
            <Plus className="h-4 w-4" /> Write Article
          </Link>
        </Button>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">You haven&apos;t written any articles yet.</p>
            <Button className="mt-5 gap-1.5" asChild>
              <Link href="/dashboard/articles/new">
                <Plus className="h-4 w-4" /> Write your first article
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => {
            const catLabel =
              ARTICLE_CATEGORIES.find((c) => c.value === article.category)?.label ??
              article.category;
            const catColor =
              ARTICLE_CATEGORY_COLORS[article.category] ?? "bg-muted text-muted-foreground";

            return (
              <Card key={article.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-4 pb-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs border-0 ${catColor}`}>{catLabel}</Badge>
                      <Badge className={`text-xs border ${STATUS_COLORS[article.status] ?? ""}`}>
                        {article.status}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm line-clamp-1">{article.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(article.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {article.status === "approved" && (
                    <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs" asChild>
                      <Link href={`/education/${article.id}`} target="_blank">
                        View
                      </Link>
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="shrink-0 h-7 text-xs gap-1" asChild>
                    <Link href={`/dashboard/articles/${article.id}/edit`}>
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
