package utils

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("super_secret_key")

type Claims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateJWT(username string, role string) (string, error) {
	claims := &Claims{
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(jwtKey)
}

func ParseJWT(tokenStr string) (*Claims, error) {
	claims := &Claims{}

	// VULNERABILITY: Decode without proper verification (for CTF purposes)
	// This is intentionally insecure - accepts any token!

	// First try normal parsing
	_, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
		// Accept any signing method - major security flaw!
		return jwtKey, nil
	})

	if err != nil {
		// If normal parsing fails, try unsafe parsing without validation
		parser := &jwt.Parser{}
		_, _, _ = parser.ParseUnverified(tokenStr, claims)
	}

	// Always return claims regardless of token validity (VULNERABLE!)
	return claims, nil
}

// AuthMiddleware - VULNERABLE: Trusts any JWT token without proper validation
// This is intentionally insecure for CTF purposes
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from cookie or Authorization header
		var tokenStr string

		// Try cookie first
		if cookie, err := c.Cookie("auth_token"); err == nil {
			tokenStr = cookie
		} else {
			// Try Authorization header
			authHeader := c.GetHeader("Authorization")
			if authHeader != "" && len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				tokenStr = authHeader[7:]
			}
		}

		if tokenStr == "" {
			c.JSON(401, gin.H{"error": "No token provided"})
			c.Abort()
			return
		}

		// VULNERABILITY: Parse token without proper validation
		claims, _ := ParseJWT(tokenStr)

		// Set user info in context (even if token is invalid!)
		c.Set("username", claims.Username)
		c.Set("role", claims.Role)
		c.Next()
	}
}
