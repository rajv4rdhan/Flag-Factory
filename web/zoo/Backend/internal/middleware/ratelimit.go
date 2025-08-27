package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

// RateLimiter represents a rate limiter for a specific client
type RateLimiter struct {
	requests    []time.Time
	mutex       sync.Mutex
	maxRequests int
	window      time.Duration
}

// RateLimiterStore holds rate limiters for different clients
type RateLimiterStore struct {
	limiters map[string]*RateLimiter
	mutex    sync.RWMutex
}

// NewRateLimiterStore creates a new rate limiter store
func NewRateLimiterStore() *RateLimiterStore {
	store := &RateLimiterStore{
		limiters: make(map[string]*RateLimiter),
	}

	// Clean up old limiters every 5 minutes
	go store.cleanup()

	return store
}

// GetLimiter gets or creates a rate limiter for a client
func (store *RateLimiterStore) GetLimiter(clientID string, maxRequests int, window time.Duration) *RateLimiter {
	store.mutex.RLock()
	limiter, exists := store.limiters[clientID]
	store.mutex.RUnlock()

	if !exists {
		store.mutex.Lock()
		// Double check in case another goroutine created it
		if limiter, exists = store.limiters[clientID]; !exists {
			limiter = &RateLimiter{
				requests:    make([]time.Time, 0),
				maxRequests: maxRequests,
				window:      window,
			}
			store.limiters[clientID] = limiter
		}
		store.mutex.Unlock()
	}

	return limiter
}

// IsAllowed checks if a request is allowed
func (rl *RateLimiter) IsAllowed() bool {
	rl.mutex.Lock()
	defer rl.mutex.Unlock()

	now := time.Now()

	// Remove requests outside the window
	validRequests := make([]time.Time, 0)
	for _, reqTime := range rl.requests {
		if now.Sub(reqTime) < rl.window {
			validRequests = append(validRequests, reqTime)
		}
	}
	rl.requests = validRequests

	// Check if we can allow this request
	if len(rl.requests) >= rl.maxRequests {
		return false
	}

	// Add current request
	rl.requests = append(rl.requests, now)
	return true
}

// cleanup removes old limiters to prevent memory leaks
func (store *RateLimiterStore) cleanup() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		store.mutex.Lock()
		now := time.Now()
		for clientID, limiter := range store.limiters {
			limiter.mutex.Lock()
			// If no requests in the last window, remove the limiter
			if len(limiter.requests) == 0 || now.Sub(limiter.requests[len(limiter.requests)-1]) > limiter.window*2 {
				delete(store.limiters, clientID)
			}
			limiter.mutex.Unlock()
		}
		store.mutex.Unlock()
	}
}

// Global rate limiter store
var globalRateLimiterStore = NewRateLimiterStore()

// RateLimitMiddleware creates a rate limiting middleware
func RateLimitMiddleware(maxRequests int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Use IP address as client identifier
		clientIP := c.ClientIP()

		// Get rate limiter for this client
		limiter := globalRateLimiterStore.GetLimiter(clientIP, maxRequests, window)

		// Check if request is allowed
		if !limiter.IsAllowed() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":       "Rate limit exceeded",
				"message":     "Too many requests. Please try again later.",
				"retry_after": window.Seconds(),
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// AuthRateLimitMiddleware provides predefined rate limiting for auth endpoints
func AuthRateLimitMiddleware() gin.HandlerFunc {
	// Allow 5 requests per minute for auth endpoints
	return RateLimitMiddleware(5, time.Minute)
}

// StrictAuthRateLimitMiddleware provides stricter rate limiting for sensitive auth operations
func StrictAuthRateLimitMiddleware() gin.HandlerFunc {
	// Allow 3 requests per 5 minutes for very sensitive operations
	return RateLimitMiddleware(3, 5*time.Minute)
}
