"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ARTICLE_CATEGORIES } from "@/lib/constants";
import type { Article } from "@/types/database";

export function ArticleEditForm({ article }: { article: Article }) {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [category, setCategory] = useState(article.category as string);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!content.trim()) { toast.error("Content is required"); return; }
    if (!category) { toast.error("Please select a category"); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update article");
      toast.success(
        data.autoApproved
          ? "Article updated and published."
          : "Article updated and resubmitted for review."
      );
      router.push("/dashboard/articles");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Article</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Saving changes will resubmit the article for admin review.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Article Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5 Essential Safety Practices for Expat Workers"
                maxLength={120}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">{title.length}/120</p>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Category <span className="text-destructive">*</span>
              </label>
              <Select
                value={category}
                onValueChange={(v: string | null) => { if (v) setCategory(v); }}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select a category…" className="cursor-pointer" />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="cursor-pointer">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Content <span className="text-destructive">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                placeholder="Write your article here. Use blank lines to separate paragraphs."
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
              <p className="text-xs text-muted-foreground mt-1">{content.length} characters</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="min-w-[120px] cursor-pointer">
                {loading ? "Saving…" : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/articles")}
                disabled={loading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
