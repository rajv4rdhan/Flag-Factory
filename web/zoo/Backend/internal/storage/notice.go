package storage

import (
	"zoo/Backend/internal/models"
	"zoo/Backend/internal/orm"
)

type NoticeStore struct {
	DB *orm.DB
}

func (s *NoticeStore) CreateNotice(title, content, author, priority string) error {
	query := `INSERT INTO notices (title, content, author, priority, created_at, updated_at) 
			  VALUES ($1, $2, $3, $4, NOW(), NOW())`
	return s.DB.Insert(query, title, content, author, priority)
}

func (s *NoticeStore) GetAllNotices() ([]models.Notice, error) {
	query := `SELECT id, title, content, author, priority, created_at, updated_at 
			  FROM notices ORDER BY 
			  CASE priority 
			  	WHEN 'critical' THEN 1 
			  	WHEN 'high' THEN 2 
			  	WHEN 'medium' THEN 3 
			  	WHEN 'low' THEN 4 
			  	ELSE 5 
			  END, created_at DESC 
			  LIMIT 5`

	rows, err := s.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notices []models.Notice
	for rows.Next() {
		var notice models.Notice
		err := rows.Scan(&notice.ID, &notice.Title, &notice.Content, &notice.Author, &notice.Priority, &notice.CreatedAt, &notice.UpdatedAt)
		if err != nil {
			continue
		}
		notices = append(notices, notice)
	}

	return notices, nil
}

func (s *NoticeStore) GetNoticeByID(id int) (*models.Notice, error) {
	query := `SELECT id, title, content, author, priority, created_at, updated_at 
			  FROM notices WHERE id = $1`

	var notice models.Notice
	err := s.DB.Get(query, []interface{}{id}, &notice.ID, &notice.Title, &notice.Content, &notice.Author, &notice.Priority, &notice.CreatedAt, &notice.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &notice, nil
}

func (s *NoticeStore) UpdateNotice(id int, title, content, priority string) error {
	query := `UPDATE notices SET title = $1, content = $2, priority = $3, updated_at = NOW() WHERE id = $4`
	return s.DB.Insert(query, title, content, priority, id)
}

func (s *NoticeStore) DeleteNotice(id int) error {
	query := `DELETE FROM notices WHERE id = $1`
	return s.DB.Insert(query, id)
}
