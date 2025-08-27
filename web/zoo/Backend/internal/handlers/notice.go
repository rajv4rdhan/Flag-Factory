package handlers

import (
	"net/http"
	"strconv"

	"zoo/Backend/internal/storage"

	"github.com/gin-gonic/gin"
)

type NoticeHandler struct {
	Store *storage.NoticeStore
}

// GetAllNotices - Anyone can view notices
func (h *NoticeHandler) GetAllNotices(c *gin.Context) {
	notices, err := h.Store.GetAllNotices()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notices"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"notices": notices,
		"count":   len(notices),
	})
}

// CreateNotice - Only admins can create notices
func (h *NoticeHandler) CreateNotice(c *gin.Context) {
	var req struct {
		Title    string `json:"title" binding:"required"`
		Content  string `json:"content" binding:"required"`
		Priority string `json:"priority"` // Optional, defaults to "medium"
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Validate priority
	if req.Priority == "" {
		req.Priority = "medium"
	}
	if req.Priority != "low" && req.Priority != "medium" && req.Priority != "high" && req.Priority != "critical" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Priority must be low, medium, high, or critical"})
		return
	}

	// Get author from context
	username, _ := c.Get("username")

	err := h.Store.CreateNotice(req.Title, req.Content, username.(string), req.Priority)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create notice"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Notice created successfully",
		"author":   username,
		"title":    req.Title,
		"priority": req.Priority,
	})
}

// GetNotice - Get specific notice by ID
func (h *NoticeHandler) GetNotice(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notice ID"})
		return
	}

	notice, err := h.Store.GetNoticeByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Notice not found"})
		return
	}

	c.JSON(http.StatusOK, notice)
}

// UpdateNotice - Only admins can update notices
func (h *NoticeHandler) UpdateNotice(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notice ID"})
		return
	}

	var req struct {
		Title    string `json:"title" binding:"required"`
		Content  string `json:"content" binding:"required"`
		Priority string `json:"priority" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Validate priority
	if req.Priority != "low" && req.Priority != "medium" && req.Priority != "high" && req.Priority != "critical" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Priority must be low, medium, high, or critical"})
		return
	}

	// Check if notice exists
	_, err = h.Store.GetNoticeByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Notice not found"})
		return
	}

	err = h.Store.UpdateNotice(id, req.Title, req.Content, req.Priority)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update notice"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notice updated successfully"})
}

// DeleteNotice - Only admins can delete notices
func (h *NoticeHandler) DeleteNotice(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notice ID"})
		return
	}

	// Check if notice exists
	_, err = h.Store.GetNoticeByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Notice not found"})
		return
	}

	err = h.Store.DeleteNotice(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete notice"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notice deleted successfully"})
}
