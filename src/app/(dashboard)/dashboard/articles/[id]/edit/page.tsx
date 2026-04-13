import { createAdminClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArticleEditForm } from "@/components/dashboard/ArticleEditForm";
import type { Article } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createAdminClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) redirect("/dashboard/articles");

  // Only the author can edit their own article
  if ((article as Article).author_id !== userId) redirect("/dashboard/articles");

  return <ArticleEditForm article={article as Article} />;
}
