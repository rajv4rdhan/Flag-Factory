package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sort"
	"zoo/Backend/internal/orm"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run migrate.go [up|down|reset]")
		os.Exit(1)
	}

	command := os.Args[1]

	// Database connection
	db := orm.Connect("postgres-xxqu.sliplane.app", "postgres", "AKGgAAHtcthqiJpG", "mydb", 5432)
	defer db.Close()

	switch command {
	case "up":
		runMigrations(db)
	case "down":
		dropTables(db)
	case "reset":
		dropTables(db)
		runMigrations(db)
	default:
		fmt.Printf("Unknown command: %s\n", command)
		fmt.Println("Available commands: up, down, reset")
		os.Exit(1)
	}
}

func runMigrations(db *orm.DB) {
	migrationsDir := "../migrations"

	files, err := ioutil.ReadDir(migrationsDir)
	if err != nil {
		log.Fatal("Error reading migrations directory:", err)
	}

	// Sort files to ensure they run in order
	sort.Slice(files, func(i, j int) bool {
		return files[i].Name() < files[j].Name()
	})

	fmt.Println("Running migrations...")

	for _, file := range files {
		if filepath.Ext(file.Name()) == ".sql" {
			fmt.Printf("Executing %s...\n", file.Name())

			content, err := ioutil.ReadFile(filepath.Join(migrationsDir, file.Name()))
			if err != nil {
				log.Printf("Error reading file %s: %v", file.Name(), err)
				continue
			}

			_, err = db.Exec(string(content))
			if err != nil {
				log.Printf("Error executing %s: %v", file.Name(), err)
				continue
			}

			fmt.Printf("✓ %s executed successfully\n", file.Name())
		}
	}

	fmt.Println("Migrations completed!")
}

func dropTables(db *orm.DB) {
	fmt.Println("Dropping tables...")

	_, err := db.Exec("DROP TABLE IF EXISTS users CASCADE")
	if err != nil {
		log.Printf("Error dropping tables: %v", err)
	} else {
		fmt.Println("✓ Tables dropped successfully")
	}
}
