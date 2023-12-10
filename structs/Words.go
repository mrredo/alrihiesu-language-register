package structs

import (
	"context"
	"encoding/json"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"main/config"
	"reflect"
	"strings"
)

type Word struct {
	ID           Snowflake    `json:"id"`
	Alrihian     string       `json:"alrihian,omitempty"`     // the word in your new language "Alrihian"
	Latvian      string       `json:"latvian,omitempty"`      // the word in Latvian
	Description  string       `json:"description,omitempty"`  // A description or additional information about the word
	PartOfSpeech PartOfSpeech `json:"partofspeech,omitempty"` // The part of speech of the word (e.g., noun, verb, adjective)
	Examples     []string     `json:"examples,omitempty"`     // Example sentences using the word
	Author       Author       `json:"author"`
	Contributors []Author     `json:"contributors"`
}
type PartOfSpeech string

type Author struct {
	ID         Snowflake
	ModifiedAt int64
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
func NewWord(word *Word) (*Word, error) {
	id, err := GenerateId(config.WordNode)
	if err != nil {
		return nil, err
	}
	word.ID = id
	col := config.WordDB.Collection(config.WordData)
	_, err = col.InsertOne(context.TODO(), *word, options.InsertOne())
	if err != nil {
		return nil, errors.New("failed inserting the word into database | id: " + string(id))
	}
	return word, nil
}
func (w *Word) RequiredFields() (emptyFields []string) {
	val := reflect.ValueOf(*w)

	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		fieldName := val.Type().Field(i).Name
		if fieldName == "ID" {
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

func (w *Word) Update() error {

	_, err := config.WordDB.Collection(config.WordData).UpdateOne(context.TODO(), bson.M{
		"id": w.ID,
	}, bson.M{"$set": w.ToMap()})
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
