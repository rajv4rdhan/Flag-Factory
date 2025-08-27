package handlers

import (
	"net/http"
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

	c.SetCookie("auth_token", token, 3600, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message":  "login successful",
		"username": user.Username,
		"role":     user.Role,
		"token":    token,
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
	})
}
