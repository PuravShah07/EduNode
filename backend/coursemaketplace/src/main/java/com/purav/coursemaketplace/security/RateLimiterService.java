package com.purav.coursemaketplace.security;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private static final int BUCKET_CAPACITY = 20;
    private static final long REFILL_INTERVAL_MILLIS = 3000; // 3 seconds per token (20 tokens / 60 seconds = 1 token / 3 seconds)

    private final ConcurrentHashMap<String, TokenBucket> buckets = new ConcurrentHashMap<>();

    public boolean isAllowed(String key) {
        TokenBucket bucket = buckets.computeIfAbsent(key, k -> new TokenBucket(BUCKET_CAPACITY));
        return bucket.tryConsume();
    }

    private static class TokenBucket {
        private final int capacity;
        private double tokens;
        private long lastRefillTimestamp;

        public TokenBucket(int capacity) {
            this.capacity = capacity;
            this.tokens = capacity;
            this.lastRefillTimestamp = System.currentTimeMillis();
        }

        public synchronized boolean tryConsume() {
            refill();
            if (tokens >= 1.0) {
                tokens -= 1.0;
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.currentTimeMillis();
            long elapsed = now - lastRefillTimestamp;
            if (elapsed > 0) {
                // Number of tokens to add based on elapsed time
                double refillAmount = (double) elapsed / REFILL_INTERVAL_MILLIS;
                tokens = Math.min(capacity, tokens + refillAmount);
                lastRefillTimestamp = now;
            }
        }
    }
}
