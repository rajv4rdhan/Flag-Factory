package handlers

import (
	"net/http"
	"zoo/Backend/internal/models"
	"zoo/Backend/internal/storage"

	"github.com/gin-gonic/gin"
)

type HomeHandler struct {
	PostStore   *storage.PostStore
	NoticeStore *storage.NoticeStore
}

func (h *HomeHandler) GetHomePage(c *gin.Context) {
	// Get posts and notices
	posts, err := h.PostStore.GetAllPosts()
	if err != nil {
		posts = []models.Post{}
	}

	notices, err := h.NoticeStore.GetAllNotices()
	if err != nil {
		notices = []models.Notice{}
	}

	// Get user info from context
	username, _ := c.Get("username")
	role, _ := c.Get("role")
	authenticated, _ := c.Get("authenticated")

	homeData := gin.H{
		"posts":   posts,
		"notices": notices,
		"user": gin.H{
			"username":      username,
			"role":          role,
			"authenticated": authenticated,
		},
		"message": "Welcome to Zoo Backend Home Page",
	}

	c.JSON(http.StatusOK, homeData)
}

// Legacy Home function to maintain compatibility
// flag
func Home(c *gin.Context) {
	c.Header("lag", "ZmxhZ3t6MDBfYjRja2VuZF9oMG1lX3BhZ2V9")
	c.JSON(http.StatusOK, gin.H{
		"message":  "Welcome to Zoo Backend",
		"version":  "1.0.0",
		"Database": "postgresql",
	})
}
