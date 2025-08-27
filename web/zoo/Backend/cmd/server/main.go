package main

import (
	"fmt"
	"os"
	"strconv"
	"zoo/Backend/internal/handlers"
	"zoo/Backend/internal/middleware"
	"zoo/Backend/internal/orm"
	"zoo/Backend/internal/storage"

	"github.com/gin-gonic/gin"
)

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func main() {
	// Database connection from environment variables
	dbHost := getEnv("DB_HOST", "postgres-vy60.sliplane.app")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "PuOQaRZ49eBUrhb7")
	dbName := getEnv("DB_NAME", "mydb")
	dbPortStr := getEnv("DB_PORT", "5432")

	dbPort, err := strconv.Atoi(dbPortStr)
	if err != nil {
		dbPort = 5432
	}

	db := orm.Connect(dbHost, dbUser, dbPassword, dbName, dbPort)

	// Initialize stores
	userStore := &storage.UserStore{DB: db}
	postStore := &storage.PostStore{DB: db}
	noticeStore := &storage.NoticeStore{DB: db}

	// Initialize handlers
	authHandler := &handlers.AuthHandler{Store: userStore}
	homeHandler := &handlers.HomeHandler{PostStore: postStore, NoticeStore: noticeStore}
	postHandler := &handlers.PostHandler{Store: postStore}
	noticeHandler := &handlers.NoticeHandler{Store: noticeStore}
	fileHandler := &handlers.FileHandler{}

	// Setup Gin with middleware
	r := gin.Default()

	// Global middleware
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.SecurityHeadersMiddleware())
	r.Use(middleware.RequestLoggingMiddleware())
	r.Use(middleware.StaticFileMiddleware())

	// Serve static files from public directory
	r.Static("/assets", "./public/assets")
	r.StaticFile("/vite.svg", "./public/vite.svg")

	// Public routes (no authentication required)
	public := r.Group("/")
	{
		// Serve index.html from public directory on root
		public.GET("/", func(c *gin.Context) {
			c.File("./public/index.html")
		})

		// Serve robots.txt
		public.GET("/robots.txt", func(c *gin.Context) {
			c.File("./public/robots.txt")
		})

		// Auth endpoints with rate limiting
		public.POST("/signup", middleware.AuthRateLimitMiddleware(), authHandler.Signup)
		public.POST("/login", middleware.AuthRateLimitMiddleware(), authHandler.Login)
	}

	// Routes with optional authentication (for viewing)
	view := r.Group("/")
	view.Use(middleware.OptionalAuthMiddleware())
	{
		view.GET("/home", homeHandler.GetHomePage)
		view.GET("/posts", postHandler.GetAllPosts)
		view.GET("/posts/:id", postHandler.GetPost)
		view.GET("/notices", noticeHandler.GetAllNotices)
		view.GET("/notices/:id", noticeHandler.GetNotice)
	}

	// Routes requiring authentication
	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())
	{
		auth.GET("/api", handlers.Home)
		auth.GET("/profile", handlers.UserProfile)
		auth.POST("/posts", postHandler.CreatePost)
		auth.PUT("/posts/:id", postHandler.UpdatePost)
		auth.DELETE("/posts/:id", postHandler.DeletePost)

		// File download functionality (vulnerable for CTF)
		auth.GET("/files", fileHandler.ListFiles)
		auth.GET("/download", fileHandler.DownloadFile)
	}

	// Admin-only routes
	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.Use(middleware.AdminOnlyMiddleware())
	{
		admin.POST("/notices", noticeHandler.CreateNotice)
		admin.PUT("/notices/:id", noticeHandler.UpdateNotice)
		admin.DELETE("/notices/:id", noticeHandler.DeleteNotice)
	}

	// Server info
	fmt.Println("🚀 Server starting on :8080")

	r.Run(":8080")
}
