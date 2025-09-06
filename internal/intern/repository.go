package intern

import (
	"database/sql"
	"internplus-backend/graph/model"
	"time"
)

func CreateIntern(db *sql.DB, intern *model.Intern) (int64, error) {
	query := `
	INSERT INTO interns 
	(first_name, last_name, phone_number, email, password, provider_id, provider, avatar_url, status, application_id, created_at, updated_at)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	result, err := db.Exec(
		query,
		intern.FirstName,
		intern.LastName,
		intern.PhoneNumber,
		intern.Email,
		intern.Password,
		intern.ProviderID,
		intern.Provider,
		intern.AvatarURL,
		intern.Status,
		intern.ApplicationID,
		time.Now(),
		time.Now(),
	)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}
