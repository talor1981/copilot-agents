# Rate Limiting Quick Reference

## Current Configuration

| Action | Limit | Window | File |
|--------|-------|--------|------|
| Create Link | 10 requests | 60 seconds | `app/dashboard/actions.ts` |
| Update Link | 20 requests | 60 seconds | `app/dashboard/actions.ts` |
| Delete Link | 10 requests | 60 seconds | `app/dashboard/actions.ts` |

## How to Add Rate Limiting to a New Server Action

### Step 1: Import the utilities
```typescript
import { checkRateLimit, createLinkLimiter } from "@/lib/rate-limit";
// Or create a custom limiter
import { RateLimiter } from "@/lib/rate-limit";
```

### Step 2: Add rate limit check after authentication
```typescript
export async function myServerAction(input: MyInput) {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Check rate limit
  const rateLimitError = checkRateLimit(myLimiter, userId);
  if (rateLimitError) {
    return rateLimitError;
  }

  // 3. Rest of your action...
}
```

### Step 3: Create custom limiter if needed
```typescript
// In lib/rate-limit.ts or your actions file
export const myCustomLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 30 * 1000, // 30 seconds
});
```

## Error Response Format

When rate limited:
```typescript
{
  success: false,
  error: "Rate limit exceeded. Please try again in 45 seconds."
}
```

## Testing Commands

```typescript
// Get current request count
const count = limiter.getRequestCount(userId);

// Reset rate limit for testing
limiter.reset(userId);

// Reset all rate limits
limiter.resetAll();
```

## Common Patterns

### Pattern 1: User-based limiting (current)
```typescript
const rateLimitError = checkRateLimit(limiter, userId);
```

### Pattern 2: IP-based limiting (future)
```typescript
import { headers } from "next/headers";
const ip = headers().get("x-forwarded-for") || "unknown";
const rateLimitError = checkRateLimit(limiter, ip);
```

### Pattern 3: Combined key
```typescript
const key = `${userId}:${action}`;
const rateLimitError = checkRateLimit(limiter, key);
```

## When to Adjust Limits

**Increase limits when:**
- Users complain about legitimate usage being blocked
- Analytics show high rate limit hits during normal usage
- Adding premium tier features

**Decrease limits when:**
- Detecting abuse patterns
- Server resources are constrained
- API costs increase

**Recommended starting points:**
- Read operations: 100-1000 per minute
- Write operations: 10-50 per minute
- Delete operations: 5-20 per minute
- Expensive operations: 1-10 per minute

## Migration to Redis (Production)

Replace in `lib/rate-limit.ts`:

```typescript
// Install: npm install @upstash/ratelimit @upstash/redis
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const createLinkLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "ratelimit:create",
});

// Usage stays the same
const { success } = await createLinkLimiter.limit(userId);
if (!success) {
  return { success: false, error: "Rate limit exceeded" };
}
```

## Troubleshooting

### Issue: Rate limit not resetting
- Check if cleanup interval is running
- Verify timestamps are being cleared
- Call `limiter.cleanup()` manually

### Issue: Same user can exceed limit
- Verify userId is consistent across requests
- Check authentication middleware
- Ensure limiter instance is shared (singleton)

### Issue: Rate limit too strict
- Review current limits in `lib/rate-limit.ts`
- Check windowMs setting
- Consider increasing maxRequests

### Issue: Memory usage growing
- Verify cleanup is running every 5 minutes
- Check for memory leaks in long-running processes
- Consider Redis for production

## Security Notes

✅ **Safe:**
- Using Clerk userId (cannot be spoofed)
- Returns clear error messages
- Automatic cleanup prevents memory leaks

⚠️ **Caution:**
- In-memory only works for single instance
- No persistence across restarts
- No cross-server synchronization

🔒 **Best Practices:**
- Always check rate limit AFTER authentication
- Use specific error messages
- Log rate limit violations
- Monitor for abuse patterns
