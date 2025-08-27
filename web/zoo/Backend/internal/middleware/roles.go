package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// AdminOnlyMiddleware - Ensures only admin users can access the endpoint
func AdminOnlyMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		if role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// ModeratorOrAdminMiddleware - Allows moderators and admins
func ModeratorOrAdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		if role != "admin" && role != "moderator" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Moderator or admin access required"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// AuthenticatedUserMiddleware - Ensures user is logged in
func AuthenticatedUserMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authenticated, exists := c.Get("authenticated")
		if !exists || authenticated == false {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		c.Next()
	}
}
