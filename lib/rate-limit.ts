/**
 * Rate Limiting Utility
 * 
 * Implements a sliding window rate limiter using in-memory Map storage.
 * Tracks requests per user to prevent DoS attacks and resource exhaustion.
 * 
 * Future Enhancement: Replace with Upstash Redis for distributed rate limiting
 */

interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the time window
   */
  maxRequests: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
}

interface RateLimitEntry {
  /**
   * Array of timestamps when requests were made
   */
  timestamps: number[];
}

class RateLimiter {
  private requestMap: Map<string, RateLimitEntry>;
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor(config: RateLimitConfig) {
    this.requestMap = new Map();
    this.config = config;
    this.cleanupInterval = null;
    
    // Start automatic cleanup every 5 minutes
    this.startCleanup();
  }

  /**
   * Check if a request should be allowed for a given identifier (usually userId)
   * Returns { success: true } if allowed, or { success: false, error: string } if rate limited
   */
  check(identifier: string): { success: boolean; error?: string } {
    const now = Date.now();
    const entry = this.requestMap.get(identifier);

    if (!entry) {
      // First request from this identifier
      this.requestMap.set(identifier, { timestamps: [now] });
      return { success: true };
    }

    // Remove timestamps outside the current window
    const windowStart = now - this.config.windowMs;
    entry.timestamps = entry.timestamps.filter(timestamp => timestamp > windowStart);

    // Check if limit exceeded
    if (entry.timestamps.length >= this.config.maxRequests) {
      const oldestTimestamp = entry.timestamps[0];
      const resetTime = Math.ceil((oldestTimestamp + this.config.windowMs - now) / 1000);
      
      return {
        success: false,
        error: `Rate limit exceeded. Please try again in ${resetTime} seconds.`,
      };
    }

    // Add current timestamp and allow request
    entry.timestamps.push(now);
    this.requestMap.set(identifier, entry);
    
    return { success: true };
  }

  /**
   * Manually clean up old entries to prevent memory leaks
   */
  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    for (const [identifier, entry] of this.requestMap.entries()) {
      // Remove timestamps outside the window
      entry.timestamps = entry.timestamps.filter(timestamp => timestamp > windowStart);
      
      // If no timestamps remain, remove the entry
      if (entry.timestamps.length === 0) {
        this.requestMap.delete(identifier);
      }
    }
  }

  /**
   * Start periodic cleanup to prevent memory growth
   */
  private startCleanup(): void {
    // Clean up every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Stop the cleanup interval (useful for testing or shutdown)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Get current request count for an identifier (useful for debugging/monitoring)
   */
  getRequestCount(identifier: string): number {
    const entry = this.requestMap.get(identifier);
    if (!entry) return 0;
    
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const validTimestamps = entry.timestamps.filter(timestamp => timestamp > windowStart);
    
    return validTimestamps.length;
  }

  /**
   * Reset rate limit for a specific identifier (useful for testing)
   */
  reset(identifier: string): void {
    this.requestMap.delete(identifier);
  }

  /**
   * Clear all rate limit data (useful for testing)
   */
  resetAll(): void {
    this.requestMap.clear();
  }
}

// Create singleton instances for different action types
// 10 link creations per minute (prevents spam link creation)
export const createLinkLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
});

// 20 link updates per minute (slightly higher since users may need to fix mistakes)
export const updateLinkLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 60 * 1000, // 1 minute
});

// 10 link deletions per minute (prevents accidental mass deletion)
export const deleteLinkLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
});

/**
 * Helper function to check rate limit in server actions
 * Returns null if allowed, or error object if rate limited
 */
export function checkRateLimit(
  limiter: RateLimiter,
  identifier: string
): { success: false; error: string } | null {
  const result = limiter.check(identifier);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error || "Rate limit exceeded. Please try again later.",
    };
  }
  
  return null;
}

// Export the RateLimiter class for custom use cases
export { RateLimiter };
export type { RateLimitConfig, RateLimitEntry };
