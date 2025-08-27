package middleware

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// CORSMiddleware - Handle CORS headers
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// RequestLoggingMiddleware - Log requests with user info
func RequestLoggingMiddleware() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		username, _ := param.Keys["username"].(string)
		if username == "" {
			username = "anonymous"
		}

		return "[" + param.TimeStamp.Format("2006-01-02 15:04:05") + "] " +
			"\"" + param.Method + " " + param.Path + "\" " +
			strconv.Itoa(param.StatusCode) + " " +
			"user:" + username + " " +
			param.Latency.String() + "\n"
	})
}

// SecurityHeadersMiddleware - Add security headers
func SecurityHeadersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")

		// Add username to context for logging
		if username, exists := c.Get("username"); exists {
			c.Set("username", username)
		}

		c.Next()
	}
}

// ContentTypeMiddleware - Validate content type for POST/PUT requests
func ContentTypeMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" {
			contentType := c.GetHeader("Content-Type")
			if !strings.Contains(contentType, "application/json") && !strings.Contains(contentType, "multipart/form-data") {
				c.JSON(http.StatusUnsupportedMediaType, gin.H{"error": "Content-Type must be application/json or multipart/form-data"})
				c.Abort()
				return
			}
		}
		c.Next()
	}
}
