package structs

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"main/config"
	"main/functions"
	"regexp"
	"strings"
	"time"
)

type Account struct {
	ID            Snowflake   `json:"id"`
	Name          string      `json:"name"`
	Password      string      `json:"password,omitempty"`
	Role          AccountRole `json:"role"`
	CreatedAt     int64       `json:"created_at"`
	BannedUntil   int64       `json:"banned_until"`
	authenticated bool        `json:"-"`
}
type AccountRole int

const (
	Default AccountRole = iota
	Mod     AccountRole = 1
	Admin   AccountRole = 2
)

var (
	nameRegex     = regexp.MustCompile(`(?m)^[a-zA-Zā-ž_0-9]+$`)
	nameMinLength = 3
	nameMaxLength = 20
	passMinLength = 8
	passMaxLength = 64
)
var (
	ErrNameNotValid      = errors.New("invalid_name")
	ErrNameNotValidDesc  = errors.New("name is not valid, name supports latvian alphabet, digits(0-9), symbols(_) and its supposed length is 3-20 characters")
	ErrAccountExists     = errors.New("account_exists")
	ErrAdminKeyNotValid  = errors.New("invalid_admin_key")
	ErrPasswordInvalid   = errors.New("invalid_password")
	ErrPasswordIncorrect = errors.New("incorrect_password")
	ErrFailedDecoding    = errors.New("failed_decoding_data")
	ErrNotAuthenticated  = errors.New("not_authenticated")
	ErrAccountNotExist   = errors.New("account_not_exist")
	ErrUserNotFound      = errors.New("user_not_found")
)

/*
Session data for backend
*/
var AccountData = map[string]Account{}

func GetAccount(filter interface{}) ([]Account, error) {
	col := config.AccountDB.Collection(config.AccountData)
	cur, err := col.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cur.Close(context.Background())

	var accounts []Account
	for cur.Next(context.Background()) {
		var account Account
		if err := cur.Decode(&account); err != nil {
			return nil, err
		}
		account.RemovePasswordField()
		accounts = append(accounts, account)
	}

	if err := cur.Err(); err != nil {
		return nil, err
	}

	return accounts, nil
}

// RetrieveAccountData
/*
public data function
*/
func RetrieveAccountData(name string) (*Account, error) {
	col := config.AccountDB.Collection(config.AccountData)
	res := col.FindOne(context.Background(), bson.M{"name": strings.ToLower(name)})
	acc := &Account{}
	if res.Err() != nil {
		return nil, ErrAccountNotExist
	}
	if err := res.Decode(acc); err != nil {
		return nil, ErrFailedDecoding
	}
	acc.RemovePasswordField()
	return acc, nil
}
func LoginAccount(basicData Account, password string) (*Account, error) {
	newAcc := &basicData
	if !newAcc.IsValidName() {
		return nil, ErrNameNotValid
	}
	newAcc.Authenticate(password)
	return newAcc, nil
}
func CreateAccount(name, pass, adminKey string) (*Account, error) {
	newAcc := &Account{
		Name:     name,
		Password: pass,
	}
	if !config.ValidAdminKey(adminKey) {
		return nil, ErrAdminKeyNotValid
	}
	if newAcc.Exists() {
		return nil, ErrAccountExists
	}
	if !newAcc.IsValidName() {
		return nil, ErrNameNotValid

	}
	if !newAcc.IsValidPassword() {
		return nil, ErrPasswordInvalid

	}
	newAcc.CreatedAt = time.Now().Unix()
	newAcc.Name = newAcc.NameToLower()
	newAcc.Role = Admin
	newAcc.generateID()
	newAcc.Password = newAcc.HashPassword()
	newAcc.Register(adminKey)

	return newAcc, nil
}

//	func BanUser(key string, mainAcc *Account, accToBan *Account) {
//		if config.ValidAdminKey(key) || mainAcc.IsAdmin() {
//		}
//	}
func (acc *Account) Get() Account {
	newacc := *acc
	newacc.RemovePasswordField()
	return newacc
}
func (acc *Account) NameToLower() string {
	return strings.ToLower(acc.Name)
}
func (acc *Account) IsValidPassword() bool {
	return len(acc.Password) >= passMinLength && len(acc.Password) <= passMaxLength
}
func (acc *Account) IsValidName() bool {
	return nameRegex.MatchString(acc.Name) && len(acc.Name) >= nameMinLength && len(acc.Name) <= nameMaxLength
}
func (acc *Account) generateID() {
	id, err := GenerateId(config.AccountNode)
	if err != nil {
		return
	}
	acc.ID = id
}
func (acc *Account) HashPassword() string {
	return functions.HashString(acc.Password)
}
func (acc *Account) Ban(accToBan *Account, duration time.Duration) {
	if acc.IsAdmin() && acc.Role != accToBan.Role && acc.Role > accToBan.Role {

	}
}
func (acc *Account) UnBan(ID string) {
	if acc.IsAdmin() {

	}
}
func (acc *Account) RemovePasswordField() {
	acc.Password = ""
}
func (acc *Account) Authenticate(password string) error {
	hashed := functions.HashString(password)
	col := config.AccountDB.Collection(config.AccountData)
	res := col.FindOne(context.Background(), bson.M{
		"name":     acc.NameToLower(),
		"password": hashed,
	})
	if res.Err() != nil {
		return ErrPasswordIncorrect
	}
	acc.authenticated = true
	return nil
}
func (acc *Account) Fetch() error {
	if acc.authenticated {
		col := config.AccountDB.Collection(config.AccountData)
		res := col.FindOne(context.Background(), bson.M{
			"name": acc.NameToLower(),
		})
		if err := res.Decode(acc); err != nil {
			return ErrFailedDecoding
		}

	} else {
		return ErrNotAuthenticated
	}
	return nil
}
func (acc *Account) Update() {

}
func (acc *Account) IsBanned() bool {
	return false
}
func (acc *Account) Exists() bool {
	col := config.AccountDB.Collection(config.AccountData)
	res := col.FindOne(context.Background(), bson.M{
		"name": acc.NameToLower(),
	})

	return res.Err() == nil
}
func (acc *Account) Register(adminKey string) error {
	if config.ValidAdminKey(adminKey) {
		col := config.AccountDB.Collection(config.AccountData)
		_, err := col.InsertOne(context.Background(), acc)
		return err
	}
	return nil
}
func (acc *Account) IsModerator() bool {
	return acc.Role == Mod
}
func (acc *Account) IsAdmin() bool {
	return acc.Role == Admin
}
func (acc *Account) Delete()                                   {}
func (acc *Account) ChangePassword(old, new string)            {}
func (acc *Account) ResetPassword(adminKey string, new string) {}
