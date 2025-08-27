package storage

import (
	"errors"
	"zoo/Backend/internal/orm"
)

type User struct {
	ID       int
	Username string
	Password string
	Role     string
}

type UserStore struct {
	DB *orm.DB
}

func (s *UserStore) Create(username, password, role string) error {
	if s.DB.Exists("SELECT EXISTS(SELECT 1 FROM users WHERE username=$1)", username) {
		return errors.New("user already exists")
	}
	return s.DB.Insert("INSERT INTO users (username, password, role) VALUES ($1,$2,$3)", username, password, role)
}
func (s *UserStore) FindUser(username string) (*User, error) {
	var u User
	err := s.DB.Get("SELECT id, username, role FROM users WHERE username=$1", []any{username}, &u.ID, &u.Username, &u.Role)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

// GetByUsername - alias for FindUser for consistency with middleware
func (s *UserStore) GetByUsername(username string) (*User, error) {
	return s.FindUser(username)
}

func (s *UserStore) Validate(username, password string) bool {
	var dbPass string
	err := s.DB.Get("SELECT password FROM users WHERE username=$1", []any{username}, &dbPass)
	if err != nil {
		return false
	}
	return dbPass == password
}
