package middleware

import (
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

// StaticFileMiddleware sets proper MIME types for static files
func StaticFileMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path

		// Handle assets directory with proper MIME types
		if strings.HasPrefix(path, "/assets/") {
			ext := strings.ToLower(filepath.Ext(path))
			switch ext {
			case ".css":
				c.Header("Content-Type", "text/css; charset=utf-8")
			case ".js":
				c.Header("Content-Type", "application/javascript; charset=utf-8")
			case ".svg":
				c.Header("Content-Type", "image/svg+xml")
			case ".png":
				c.Header("Content-Type", "image/png")
			case ".jpg", ".jpeg":
				c.Header("Content-Type", "image/jpeg")
			case ".gif":
				c.Header("Content-Type", "image/gif")
			case ".woff", ".woff2":
				c.Header("Content-Type", "font/woff")
			case ".ttf":
				c.Header("Content-Type", "font/ttf")
			case ".eot":
				c.Header("Content-Type", "application/vnd.ms-fontobject")
			}
		}

		// Handle other static files
		if path == "/vite.svg" {
			c.Header("Content-Type", "image/svg+xml")
		} else if path == "/robots.txt" {
			c.Header("Content-Type", "text/plain; charset=utf-8")
		} else if path == "/" || strings.HasSuffix(path, ".html") {
			c.Header("Content-Type", "text/html; charset=utf-8")
		}

		c.Next()
	}
}
