package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"zoo/Backend/internal/orm"

	"github.com/joho/godotenv"
)

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func main() {
	fmt.Println("🔧 Database Initialization Utility")
	fmt.Println("==================================")

	// Connect to database
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}
	// Database connection from environment variables
	dbHost := getEnv("DB_HOST", "")
	dbUser := getEnv("DB_USER", "")
	dbPassword := getEnv("DB_PASSWORD", "")
	dbName := getEnv("DB_NAME", "")
	dbPortStr := getEnv("DB_PORT", "")
	sslmode := getEnv("SSLMODE", "")
	dbPort, err := strconv.Atoi(dbPortStr)
	if err != nil {
		dbPort = 5432
	}

	db := orm.Connect(dbHost, dbUser, dbPassword, dbName, dbPort, sslmode)

	// Initialize database
	if err := initializeDatabase(db); err != nil {
		log.Fatal("❌ Failed to initialize database:", err)
	}

	fmt.Println("✅ Database initialized successfully!")
	fmt.Println("")
	fmt.Println("👥 Sample users created:")
	fmt.Println("  admin/admin123 (admin)")
	fmt.Println("  user1/password123 (user)")
	fmt.Println("  moderator/mod123 (moderator)")
	fmt.Println("  + 7 more test users")
	fmt.Println("")
	fmt.Println("🚀 Ready to start server: go run cmd/server/main.go")
}

func initializeDatabase(db *orm.DB) error {
	fmt.Println("📦 Creating tables...")

	// Create users table
	createUsersTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		username VARCHAR(255) UNIQUE NOT NULL,
		password VARCHAR(255) NOT NULL,
		role VARCHAR(50) DEFAULT 'user',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);`

	if _, err := db.Exec(createUsersTableSQL); err != nil {
		return fmt.Errorf("failed to create users table: %v", err)
	}

	// Create posts table
	createPostsTableSQL := `
	CREATE TABLE IF NOT EXISTS posts (
		id SERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		content TEXT NOT NULL,
		author VARCHAR(255) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);
	CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);`

	if _, err := db.Exec(createPostsTableSQL); err != nil {
		return fmt.Errorf("failed to create posts table: %v", err)
	}

	// Create notices table
	createNoticesTableSQL := `
	CREATE TABLE IF NOT EXISTS notices (
		id SERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		content TEXT NOT NULL,
		author VARCHAR(255) NOT NULL,
		priority VARCHAR(20) DEFAULT 'medium',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_notices_priority ON notices(priority);
	CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at);`

	if _, err := db.Exec(createNoticesTableSQL); err != nil {
		return fmt.Errorf("failed to create notices table: %v", err)
	}

	fmt.Println("✓ Users table created")
	fmt.Println("👤 Inserting sample users...")

	// Insert sample data
	sampleData := []struct {
		username, password, role string
	}{
		{"admin", "CTF{H4R0_tr4v3rs4l_ch4mp10n}", "admin"},
		{"user1", "password123", "user"},
		{"user2", "password456", "user"},
		{"moderator", "mod123", "moderator"},
		{"testuser", "test123", "user"},
		{"john_doe", "johndoe456", "user"},
		{"jane_smith", "janesmith789", "user"},
		{"bob_wilson", "bobwilson321", "user"},
		{"alice_brown", "alicebrown654", "user"},
		{"charlie_davis", "charliedavis987", "user"},
	}

	for _, user := range sampleData {
		insertSQL := `INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING`
		if err := db.Insert(insertSQL, user.username, user.password, user.role); err != nil {
			return fmt.Errorf("failed to insert user %s: %v", user.username, err)
		}
	}

	fmt.Printf("✓ %d sample users inserted\n", len(sampleData))

	// Insert sample posts
	fmt.Println("📝 Inserting sample posts...")
	samplePosts := []struct {
		title, content, author string
	}{
		{"Welcome to the Digital Zoo", "Welcome to our amazing digital zoo! Explore virtual exhibits and learn about wildlife from around the world.", "admin"},
		{"New Animal Exhibit: Arctic Foxes", "We've just added a stunning Arctic Fox exhibit with interactive features and educational content.", "admin"},
		{"Zoo Safety Guidelines", "Please follow all zoo safety guidelines when visiting exhibits and interacting with virtual animals.", "moderator"},
		{"My First Zoo Visit", "Just visited the penguin exhibit - absolutely amazing! Can't wait to explore more animals.", "user1"},
		{"Feeding Schedule Issue", "The lion feeding schedule seems to be showing incorrect times in the mobile app.", "user2"},
		{"Feature Request: Night Mode for Nocturnal Animals", "Would love to see a night vision mode to observe nocturnal animals in their natural behavior.", "testuser"},
	}

	for _, post := range samplePosts {
		insertPostSQL := `INSERT INTO posts (title, content, author, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) ON CONFLICT DO NOTHING`
		if err := db.Insert(insertPostSQL, post.title, post.content, post.author); err != nil {
			return fmt.Errorf("failed to insert post %s: %v", post.title, err)
		}
	}

	fmt.Printf("✓ %d sample posts inserted\n", len(samplePosts))

	// Insert sample notices
	fmt.Println("📢 Inserting sample notices...")
	sampleNotices := []struct {
		title, content, author, priority string
	}{
		{"Zoo Security Alert", "Visitor access user_data may have been compromised. Please update your zoo membership passwords.", "admin", "critical"},
		{"Animal Exhibit Maintenance", "The tropical rainforest exhibit will be closed this weekend from 2-4 AM for habitat maintenance.", "admin", "high"},
		{"Zoo Safety Update", "New safety protocols implemented. Please review updated visitor guidelines before your next visit.", "admin", "critical"},
		{"New Zoo Features Available", "Explore our new virtual animal encounters and interactive feeding experiences!", "admin", "medium"},
		{"Zoo Visitor Guidelines", "Please respect our animals and follow all zoo safety rules during your visit.", "moderator", "low"},
	}

	for _, notice := range sampleNotices {
		insertNoticeSQL := `INSERT INTO notices (title, content, author, priority, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) ON CONFLICT DO NOTHING`
		if err := db.Insert(insertNoticeSQL, notice.title, notice.content, notice.author, notice.priority); err != nil {
			return fmt.Errorf("failed to insert notice %s: %v", notice.title, err)
		}
	}

	fmt.Printf("✓ %d sample notices inserted\n", len(sampleNotices))
	return nil
}
