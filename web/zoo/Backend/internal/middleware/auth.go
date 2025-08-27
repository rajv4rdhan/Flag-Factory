package middleware

import (
	"zoo/Backend/internal/utils"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware - JWT authentication middleware
func AuthMiddleware() gin.HandlerFunc {
	return utils.AuthMiddleware()
}

// OptionalAuthMiddleware - JWT authentication but allows unauthenticated users
func OptionalAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenStr string

		if cookie, err := c.Cookie("auth_token"); err == nil {
			tokenStr = cookie
		} else {
			authHeader := c.GetHeader("Authorization")
			if authHeader != "" && len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				tokenStr = authHeader[7:]
			}
		}

		if tokenStr != "" {
			claims, _ := utils.ParseJWT(tokenStr)
			c.Set("username", claims.Username)
			c.Set("role", claims.Role)
			c.Set("authenticated", true)
		} else {
			c.Set("username", "")
			c.Set("role", "guest")
			c.Set("authenticated", false)
		}

		c.Next()
	}
}
