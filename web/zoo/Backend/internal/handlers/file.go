package handlers

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

type FileHandler struct{}

// DownloadFile handles file downloads with intentionally vulnerable path traversal
// This endpoint is designed for CTF - DO NOT USE IN PRODUCTION
func (f *FileHandler) DownloadFile(c *gin.Context) {
	filename := c.Query("file")
	if filename == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File parameter is required"})
		return
	}

	// Basic "security" check that can be bypassed
	// This is intentionally weak for the CTF challenge
	if strings.Contains(filename, "..") {
		// Check if it's a "legitimate" traversal (hint for CTF players)
		if !strings.Contains(filename, "user_data") && !strings.Contains(filename, "scripts") {
			c.JSON(http.StatusForbidden, gin.H{"error": "Directory traversal detected"})
			return
		}
	}

	// Construct file path - vulnerable to path traversal
	basePath := "./ctf_files/user_data/"
	filePath := filepath.Join(basePath, filename)

	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// Read and serve the file
	fileContent, err := os.ReadFile(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading file"})
		return
	}

	// Set appropriate headers
	c.Header("Content-Disposition", "attachment; filename=\""+filepath.Base(filename)+"\"")
	c.Header("Content-Type", "application/octet-stream")
	c.Data(http.StatusOK, "application/octet-stream", fileContent)
}

// ListFiles shows available files in user_data directory
func (f *FileHandler) ListFiles(c *gin.Context) {
	files := []string{
		"readme.txt",
		"uploaded_files.txt",
		"animal_report_2024.pdf",
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Available user files",
		"files":   files,
		"hint":    "Use ?file=filename to download. Some files might be in subdirectories...",
	})
}
