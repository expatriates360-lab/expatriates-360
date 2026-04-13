"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
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

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!content.trim()) { toast.error("Content is required"); return; }
    if (!category) { toast.error("Please select a category"); return; }
    if (!recaptchaToken) { toast.error("Please complete the reCAPTCHA verification"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), category, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit article");
      toast.success("Article submitted for review!");
      router.push("/dashboard/articles");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      // Reset reCAPTCHA so the user can retry
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Write an Article</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Articles are reviewed before being published on the Education Hub.
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
              <Select value={category} onValueChange={(v: string | null) => { if (v) setCategory(v); }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category…" className="cursor-pointer" />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="cursor-pointer" >
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

            {/* reCAPTCHA */}
            <div>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
                onChange={(token) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading || !recaptchaToken} className="min-w-[120px] cursor-pointer">
                {loading ? "Submitting…" : "Submit for Review"}
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
