package structs

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"main/config"
	"reflect"
	"strings"
	"time"
)

type Word struct {
	ID           Snowflake    `json:"id"`
	Alrihian     string       `json:"alrihian,omitempty"`     // the word in your new language "Alrihian"
	Latvian      string       `json:"latvian,omitempty"`      // the word in Latvian
	Description  string       `json:"description,omitempty"`  // A description or additional information about the word
	PartOfSpeech PartOfSpeech `json:"partofspeech,omitempty"` // The part of speech of the word (e.g., noun, verb, adjective)
	Examples     []string     `json:"examples,omitempty"`     // Example sentences using the word
	Author       Author       `json:"author"`
	//Contributors []Author     `json:"contributors"`
}
type PartOfSpeech string

type Author struct {
	ID         Snowflake `json:"id,omitempty"`
	ModifiedAt int64     `json:"modifiedat,omitempty"`
}

const (
	Noun        PartOfSpeech = "noun"        // Latvian: "Lietvārds"
	Verb        PartOfSpeech = "verb"        // Latvian: "Darbības vārds"
	Adjective   PartOfSpeech = "adjective"   // Latvian: "Īpašības vārds"
	Adverb      PartOfSpeech = "adverb"      // Latvian: "Apstāklis"
	Pronoun     PartOfSpeech = "pronoun"     // Latvian: "Vietniekvārds"
	Conjunction PartOfSpeech = "conjunction" // Latvian: "Savienojuma vārds"
	Preposition PartOfSpeech = "preposition" // Latvian: "Prievārds"
	Other       PartOfSpeech = "other"       // Latvian: "Cits"
)

var (
// ErrAccount
)

func WordExists(id Snowflake) bool {
	col := config.WordDB.Collection(config.WordData)
	data := col.FindOne(context.TODO(), bson.M{
		"id": id,
	})
	if data.Err() != nil {
		return false
	}

	return true
}
func WordExistsUni(key, field string) bool {
	col := config.WordDB.Collection(config.WordData)

	data := col.FindOne(context.TODO(), bson.M{
		key: field,
	})
	if data.Err() != nil {
		return false
	}

	return true
}
func RemoveWord(id Snowflake) error {
	col := config.WordDB.Collection(config.WordData)
	_, err := col.DeleteOne(context.TODO(), bson.M{
		"id": id,
	})
	if err != nil {
		return errors.New("failed deleting the word | id: " + string(id))
	}
	return nil
}
func NewWord(word *Word, user Account) (*Word, error) {
	id, err := GenerateId(config.WordNode)
	if err != nil {
		return nil, err
	}
	word.ID = id
	word.Author = Author{
		ID:         user.ID,
		ModifiedAt: time.Now().Unix(),
	}
	col := config.WordDB.Collection(config.WordData)
	_, err = col.InsertOne(context.TODO(), *word, options.InsertOne())
	if err != nil {
		return nil, errors.New("failed inserting the word into database | id: " + string(id))
	}
	return word, nil
}

var excludedFields = map[string]struct{}{
	"ID":           {},
	"contributors": {},
	"author":       {},
}

func (w *Word) RequiredFields() (emptyFields []string) {
	val := reflect.ValueOf(*w)

	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		fieldName := val.Type().Field(i).Name
		if _, ok := excludedFields[fieldName]; ok {
			continue
		}
		switch field.Kind() {
		case reflect.String:
			if field.String() == "" {
				emptyFields = append(emptyFields, strings.ToLower(fieldName))
			}
		case reflect.Slice:
			if field.Len() == 0 {
				emptyFields = append(emptyFields, strings.ToLower(fieldName))
			}
		}
	}
	return
}
func (w *Word) AddExample(example string) {
	w.Examples = append(w.Examples, example)
}

func (w *Word) Update(sessionKey string) error {
	col := config.WordDB.Collection(config.WordData)
	res := col.FindOne(context.Background(), bson.M{
		"id": w.ID,
	})
	NewWordT := &Word{}
	if err := res.Decode(&NewWordT); err != nil {
		return err
	}
	if NewWordT.Author.ID == "" {
		data, ok := AccountData[sessionKey]
		if !ok {
			return ErrUserNotFound
		}
		//newAcc := &Account{ID: data.ID}
		//newAcc.Fetch()
		w.Author = Author{
			ID:         data.ID,
			ModifiedAt: time.Now().Unix(),
		}
	} else {
		w.Author = NewWordT.Author
	}
	fmt.Println(w.Author)
	_, err := col.UpdateOne(context.Background(), bson.M{
		"id": w.ID,
	}, bson.M{"$set": w})
	return err
}
func (w *Word) ToMap() map[string]interface{} {
	jsonData, err := json.Marshal(w)
	if err != nil {
		return nil
		//return nil, err
	}

	var result map[string]interface{}
	err = json.Unmarshal(jsonData, &result)
	if err != nil {
		//return nil, err
		return nil

	}

	return result
}
func (w *Word) Fetch(key, field string) error {
	col := config.WordDB.Collection(config.WordData)
	data := col.FindOne(context.TODO(), bson.M{
		key: field,
	})
	data.Decode(w)

	if w.Alrihian == "" {
		return errors.New("failed fetching the word")
	}
	return nil
}
func (w *Word) RemoveExample(index int) {
	if index >= 0 && index < len(w.Examples) {
		w.Examples = append(w.Examples[:index], w.Examples[index+1:]...)
	}
}
