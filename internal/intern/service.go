package intern

import (
	"database/sql"
	"fmt"
	"internplus-backend/graph/model"
	"internplus-backend/utils"
)

func RegisterIntern(db *sql.DB, input model.NewInternInput) (*model.Intern, error) {
	// hash password
	hashed, err := utils.HashPassword(input.Password)
	if err != nil {
		return nil, err
	}

	// 设置默认值
	intern := &model.Intern{
		FirstName:     input.FirstName,
		LastName:      input.LastName,
		PhoneNumber:   input.PhoneNumber,
		Email:         input.Email,
		Password:      hashed,
		ProviderID:    input.ProviderID,
		Provider:      input.Provider,
		AvatarURL:     input.AvatarURL,
		Status:        utils.StringPtr("active"),
		ApplicationID: input.ApplicationID,
	}

	id, err := CreateIntern(db, intern)
	if err != nil {
		return nil, err
	}
	intern.ID = fmt.Sprintf("%d", id)
	return intern, nil
}
