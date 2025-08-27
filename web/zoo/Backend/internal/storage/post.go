package storage

import (
	"zoo/Backend/internal/models"
	"zoo/Backend/internal/orm"
)

type PostStore struct {
	DB *orm.DB
}

func (s *PostStore) CreatePost(title, content, author string) error {
	query := `INSERT INTO posts (title, content, author, created_at, updated_at) 
			  VALUES ($1, $2, $3, NOW(), NOW())`
	return s.DB.Insert(query, title, content, author)
}

func (s *PostStore) GetAllPosts() ([]models.Post, error) {
	query := `SELECT id, title, content, author, created_at, updated_at 
			  FROM posts ORDER BY created_at DESC LIMIT 10`

	rows, err := s.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var post models.Post
		err := rows.Scan(&post.ID, &post.Title, &post.Content, &post.Author, &post.CreatedAt, &post.UpdatedAt)
		if err != nil {
			continue
		}
		posts = append(posts, post)
	}

	return posts, nil
}

func (s *PostStore) GetPostByID(id int) (*models.Post, error) {
	query := `SELECT id, title, content, author, created_at, updated_at 
			  FROM posts WHERE id = $1`

	var post models.Post
	err := s.DB.Get(query, []interface{}{id}, &post.ID, &post.Title, &post.Content, &post.Author, &post.CreatedAt, &post.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &post, nil
}

func (s *PostStore) UpdatePost(id int, title, content string) error {
	query := `UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3`
	return s.DB.Insert(query, title, content, id)
}

func (s *PostStore) DeletePost(id int) error {
	query := `DELETE FROM posts WHERE id = $1`
	return s.DB.Insert(query, id)
}
