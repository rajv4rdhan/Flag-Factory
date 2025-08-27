package handlers

import (
	"net/http"
	"strconv"

	"zoo/Backend/internal/storage"

	"github.com/gin-gonic/gin"
)

type PostHandler struct {
	Store *storage.PostStore
}

// GetAllPosts - Anyone can view posts
func (h *PostHandler) GetAllPosts(c *gin.Context) {
	posts, err := h.Store.GetAllPosts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"count": len(posts),
	})
}

// CreatePost - Anyone can create posts (but need to be authenticated)
func (h *PostHandler) CreatePost(c *gin.Context) {
	var req struct {
		Title   string `json:"title" binding:"required"`
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Get author from context (set by auth middleware)
	username, exists := c.Get("username")
	if !exists {
		username = "anonymous"
	}

	err := h.Store.CreatePost(req.Title, req.Content, username.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Post created successfully",
		"author":  username,
		"title":   req.Title,
	})
}

// GetPost - Get specific post by ID
func (h *PostHandler) GetPost(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	post, err := h.Store.GetPostByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	c.JSON(http.StatusOK, post)
}

// UpdatePost - Only post author or admin can update
func (h *PostHandler) UpdatePost(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	var req struct {
		Title   string `json:"title" binding:"required"`
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Check if post exists and get current author
	post, err := h.Store.GetPostByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// Check permissions
	username, _ := c.Get("username")
	role, _ := c.Get("role")

	if post.Author != username && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only edit your own posts"})
		return
	}

	err = h.Store.UpdatePost(id, req.Title, req.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post updated successfully"})
}

// DeletePost - Only post author or admin can delete
func (h *PostHandler) DeletePost(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	// Check if post exists and get current author
	post, err := h.Store.GetPostByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// Check permissions
	username, _ := c.Get("username")
	role, _ := c.Get("role")

	if post.Author != username && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete your own posts"})
		return
	}

	err = h.Store.DeletePost(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}
