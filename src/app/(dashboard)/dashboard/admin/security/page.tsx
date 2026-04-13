import { createAdminClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, Users, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSecurityPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createAdminClient();

  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (caller?.role !== "admin") redirect("/dashboard");

  // Stats
  let totalUsers = 0;
  let deletedUsers = 0;
  let adminCount = 0;
  let recentSignups = 0;

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [allRes, deletedRes, adminRes, recentRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("profiles").select("id", { count: "exact", head: true }).not("deleted_at", "is", null),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin").is("deleted_at", null),
      supabase.from("profiles").select("id", { count: "exact", head: true }).is("deleted_at", null).gte("created_at", sevenDaysAgo.toISOString()),
    ]);

    totalUsers = allRes.count ?? 0;
    deletedUsers = deletedRes.count ?? 0;
    adminCount = adminRes.count ?? 0;
    recentSignups = recentRes.count ?? 0;
  } catch {
    // empty state
  }

  const stats = [
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      label: "Active Accounts",
      value: totalUsers,
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: <ShieldAlert className="h-5 w-5 text-red-600" />,
      label: "Deleted (soft)",
      value: deletedUsers,
      bg: "bg-red-50 dark:bg-red-950/30",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-purple-600" />,
      label: "Admin Accounts",
      value: adminCount,
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      icon: <Clock className="h-5 w-5 text-green-600" />,
      label: "Signups (7 days)",
      value: recentSignups,
      bg: "bg-green-50 dark:bg-green-950/30",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security Overview</h1>
        <p className="text-sm text-muted-foreground">Account health and access summary</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className={s.bg}>
            <CardContent className="pt-5 pb-5 flex flex-col items-center text-center">
              <div className="mb-2">{s.icon}</div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Security Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            Authentication is managed by Clerk — passwords are never stored in this database.
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            File access for CVs is controlled server-side via signed URL generation.
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            All admin actions (role change, delete, job moderation) require a verified admin session.
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            Row Level Security (RLS) is enforced in Supabase for all tables.
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            Account deletion is soft (deleted_at timestamp) — data is not permanently erased immediately.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
