// ============================================================
// Rate Limiter — Upstash Redis primary + In-memory fallback
// ============================================================

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory fallback store
const memoryStore = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute per IP

/**
 * In-memory rate limiter (no external dependency)
 */
function memoryRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS - 1, reset: now + WINDOW_MS };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false, limit: MAX_REQUESTS, remaining: 0, reset: entry.resetAt };
  }

  entry.count++;
  return {
    success: true,
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - entry.count,
    reset: entry.resetAt,
  };
}

// Clean up memory store every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    memoryStore.forEach((value, key) => {
      if (now > value.resetAt) {
        memoryStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

/**
 * Rate limit an API request by IP
 * Uses Upstash if env vars present, otherwise falls back to in-memory
 */
export async function rateLimit(identifier: string): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Use Upstash if configured
  if (upstashUrl && upstashToken) {
    try {
      const key = `rate_limit:${identifier}`;
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - 60; // 1 minute window

      // Use Upstash REST API directly (no SDK needed for edge)
      const response = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['ZADD', key, now, `${now}-${Math.random()}`],
          ['ZREMRANGEBYSCORE', key, '-inf', windowStart],
          ['ZCARD', key],
          ['EXPIRE', key, 60],
        ]),
      });

      if (response.ok) {
        const data = await response.json() as Array<{ result: number }>;
        const count = data[2]?.result || 0;
        const remaining = Math.max(0, MAX_REQUESTS - count);
        const success = count <= MAX_REQUESTS;

        return {
          success,
          limit: MAX_REQUESTS,
          remaining,
          reset: (now + 60) * 1000,
        };
      }
    } catch {
      // Fall through to memory limiter
    }
  }

  // Fallback to in-memory
  return memoryRateLimit(identifier);
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  return 'unknown';
}
