// src/lib/rateLimit.ts
// Simple in-memory rate limiter for API routes (spec: Security → Rate Limiting).
// Suitable for a single-server deployment (your Coolify VPS). If you later
// scale to multiple instances, swap this for a Redis-backed limiter.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodically clean expired buckets to avoid unbounded memory growth
const CLEAN_INTERVAL = 10 * 60 * 1000;
let lastClean = Date.now();

/**
 * Returns true if the request identified by `key` is within the limit.
 *
 * @param key       Unique identifier — usually `${routeName}:${userIdOrIp}`
 * @param limit     Max requests allowed within the window (default 10)
 * @param windowMs  Window length in ms (default 60s)
 */
export function rateLimit(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();

  if (now - lastClean > CLEAN_INTERVAL) {
    for (const [k, b] of buckets) {
      if (b.resetAt < now) buckets.delete(k);
    }
    lastClean = now;
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

/** Extracts a best-effort client IP from a Request (behind Coolify/proxy). */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/*
USAGE — add near the top of any POST handler, e.g. /api/jobs, /api/market,
/api/articles, /api/contact:

  import { rateLimit, getClientIp } from "@/lib/rateLimit";

  // inside POST(req):
  const { userId } = await auth();
  const rlKey = `jobs:${userId ?? getClientIp(req)}`;
  if (!rateLimit(rlKey, 5, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

Suggested limits:
  /api/contact  → 3 per 60s per IP
  /api/jobs     → 5 per 60s per user
  /api/market   → 5 per 60s per user
  /api/articles → 3 per 60s per user
*/
