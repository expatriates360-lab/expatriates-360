"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_COLORS } from "@/lib/constants";
import type { Article } from "@/types/database";

interface ArticleWriter {
  full_name: string;
  username: string | null;
}

interface ArticleModerationActionsProps {
  articleId: string;
  currentStatus: string;
  article: Article;
  writer: ArticleWriter | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-green-100 text-green-800 border-green-200",
};

export function ArticleModerationActions({
  articleId,
  currentStatus,
  article,
  writer,
}: ArticleModerationActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [approveLoading, setApproveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  async function approve() {
    setApproveLoading(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStatus("approved");
      toast.success("Article approved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setApproveLoading(false);
    }
  }

  async function deleteArticle() {
    if (!confirm("Delete this article permanently?")) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      toast.success("Article deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setDeleteLoading(false);
    }
  }

  const catLabel =
    ARTICLE_CATEGORIES.find((c) => c.value === article.category)?.label ??
    article.category;
  const catColor =
    ARTICLE_CATEGORY_COLORS[article.category] ?? "bg-muted text-muted-foreground";

  return (
    <>
      <div className="flex items-center gap-2">
        <Badge className={`text-xs border ${STATUS_COLORS[status] ?? ""}`}>{status}</Badge>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs px-2 gap-1"
          onClick={() => setViewOpen(true)}
          disabled={approveLoading || deleteLoading}
        >
          <Eye className="h-3.5 w-3.5" /> View
        </Button>
        {status !== "approved" && (
          <Button
            size="sm"
            className="h-7 text-xs px-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={approve}
            disabled={approveLoading || deleteLoading}
          >
            {approveLoading ? "…" : "Approve"}
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          className="h-7 text-xs px-2"
          onClick={deleteArticle}
          disabled={approveLoading || deleteLoading}
        >
          {deleteLoading ? "…" : "Delete"}
        </Button>
      </div>

      {/* Quick View Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-[90vw] md:max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-lg font-bold leading-snug pr-6">
              {article.title}
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={`text-xs border-0 ${catColor}`}>{catLabel}</Badge>
              <Badge className={`text-xs border ${STATUS_COLORS[status] ?? ""}`}>{status}</Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(article.created_at).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </DialogHeader>

          {/* Writer info */}
          <div className="shrink-0 flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">
                {writer?.full_name ?? "Unknown Author"}
              </p>
              {writer?.username && (
                <p className="text-xs text-muted-foreground mt-0.5">@{writer.username}</p>
              )}
            </div>
          </div>

          {/* Article content */}
          <div className="overflow-y-auto max-h-[60vh]">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {article.content}
              </p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="shrink-0 flex items-center justify-end gap-2 pt-2">
            {status !== "approved" && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                onClick={() => { approve(); setViewOpen(false); }}
                disabled={approveLoading || deleteLoading}
              >
                {approveLoading ? "…" : "Approve"}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
