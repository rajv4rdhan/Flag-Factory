package handlers

import (
	"encoding/base64"
	"net/http"
	"os"
	"zoo/Backend/internal/storage"
	"zoo/Backend/internal/utils"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	Store *storage.UserStore
}

func (h *AuthHandler) Signup(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}
	if req.Role == "" {
		req.Role = "user"
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}
	if err := h.Store.Create(req.Username, req.Password, req.Role); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "signup successful"})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	if !h.Store.Validate(req.Username, req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	user, err := h.Store.FindUser(req.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user info"})
		return
	}

	token, err := utils.GenerateJWT(user.Username, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	domain := os.Getenv("COOKIE_DOMAIN")
	if domain == "" {
		domain = ""
	}

	isProduction := os.Getenv("ENVIRONMENT") == "production" || os.Getenv("RENDER") == "true"

	c.SetCookie("auth_token", token, 3600, "/", domain, isProduction, true)

	c.JSON(http.StatusOK, gin.H{
		"message":  "login successful",
		"username": user.Username,
		"role":     user.Role,
		"token":    token,
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	domain := os.Getenv("COOKIE_DOMAIN")
	if domain == "" {
		domain = ""
	}

	isProduction := os.Getenv("ENVIRONMENT") == "production" || os.Getenv("RENDER") == "true"

	c.SetCookie("auth_token", "", -1, "/", domain, isProduction, true)

	c.JSON(http.StatusOK, gin.H{"message": "logout successful"})
}
func (h *AuthHandler) UserProfileSetting(c *gin.Context) {
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	user, err := h.Store.UserSetting(username.(string))
	if err != nil {
		if err.Error() == "user not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"username": user.Username,
		"role":     user.Role,
		"password": user.Password,
		"message":  "User settings retrieved successfully",
	})
}

// UserProfile - Shows current user info
func UserProfile(c *gin.Context) {
	username, _ := c.Get("username")
	role, _ := c.Get("role")

	c.JSON(http.StatusOK, gin.H{
		"username": username,
		"role":     role,
		"message":  "This is your profile",
		//flag
		"metadata": map[string]interface{}{
			"build":  "v1.0.0",
			"config": base64.StdEncoding.EncodeToString([]byte("flag{b4s364_m3t4d4t4_fl4g}")),
		},
	})
}
