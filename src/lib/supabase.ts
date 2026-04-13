import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Client-side / server component client (uses anon key + RLS)
// Lazily initialized to avoid module-load-time errors when env vars are absent
let _supabase: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (!_supabase) {
    _supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

// Also export the lazy accessor as `supabase` for backward compat with direct import usage
// Note: call this as `supabase()` not `supabase.from()`
export { getSupabaseClient as supabaseClient };

// Server-side admin client (bypasses RLS — use ONLY in secure server contexts)
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { persistSession: false } }
  );
}
