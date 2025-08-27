package orm

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

func Connect(host, user, password, dbname string, port int) *DB {
	psqlInfo := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable",
		host, user, password, dbname, port,
	)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	return &DB{db}
}

func (db *DB) Insert(query string, args ...any) error {
	_, err := db.Exec(query, args...)
	return err
}

func (db *DB) Get(query string, args []any, dest ...any) error {
	return db.QueryRow(query, args...).Scan(dest...)
}

func (db *DB) Exists(query string, args ...any) bool {
	var exists bool
	err := db.QueryRow(query, args...).Scan(&exists)
	return err == nil && exists
}
