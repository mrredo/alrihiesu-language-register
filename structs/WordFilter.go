package structs

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"main/config"
	"math"
	"time"
)

type WordFilter struct {
	SpecificWords []string      `json:"specific_words,omitempty"`
	Order         AlphabetOrder `json:"order,omitempty"`
	Page          int           `json:"page,omitempty"`
	//Limit         int            `json:"limit,omitempty"`
	WordsPerPage int            `json:"words_per_page,omitempty"`
	PartOfSpeech []PartOfSpeech `json:"part_of_speech,omitempty"`
	StartsWith   string         `json:"starts_with,omitempty"`
	EndsWith     string         `json:"ends_with,omitempty"`
	Contains     string         `json:"contains,omitempty"`
}
type ApiGetInfo struct {
	DocumentCount         int `json:"document_count"`
	DocumentCountByFilter int `json:"document_count_by_filter"`
	CurrentPage           int `json:"current_page"`
	PageCount             int `json:"page_count"`
	Data                  any `json:"data"`
}

//Limit, Order, WordsPerPage are disabled for now

type AlphabetOrder int

const (
	Abc AlphabetOrder = iota - 1
	None
	Zxy
)

func (f *WordFilter) Exec(pageNumber int) (*ApiGetInfo, error) {
	// Create a filter based on the WordFilter struct.
	info := &ApiGetInfo{}
	filter := f.mongoDBString()
	if pageNumber <= 0 {
		pageNumber = 1
	}
	// Define your MongoDB connection options.
	// Access your MongoDB collection.
	collection := config.WordDB.Collection(config.WordData)

	// Define your context with a timeout.
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Calculate skip and limit for pagination.
	skip := (pageNumber - 1) * f.WordsPerPage
	//limit := f.WordsPerPage

	// Define the options for the find operation.
	option := options.Find().SetLimit(int64(f.WordsPerPage)).SetSkip(int64(skip)) /*.SetLimit(int64(limit))*/
	// Add sorting option if Order is specified.
	if f.Order == Abc || f.Order == Zxy {
		option.SetSort(bson.D{{"alrihian", int(f.Order)}})
	}
	//fmt.Println(*option.Limit, *option.Skip, skip)
	// Perform the find operation with the filter and options.
	cursor, err := collection.Find(ctx, filter, option)

	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Define a slice to store your query results.
	var results []Word

	// Iterate through the cursor to decode the results.
	for cursor.Next(ctx) {
		var result Word
		err := cursor.Decode(&result)
		if err != nil {
			return nil, err
		}
		results = append(results, result)
	}
	numF, _ := collection.CountDocuments(context.Background(), filter)
	num, _ := collection.CountDocuments(context.Background(), bson.M{})

	pages := 1
	if f.WordsPerPage > 0 {
		pages = int(numF) / f.WordsPerPage
	}
	if math.Mod(float64(numF), float64(f.WordsPerPage)) != 0 {
		pages++
	}
	info = &ApiGetInfo{
		DocumentCount:         int(num),
		DocumentCountByFilter: int(numF),
		CurrentPage:           pageNumber,
		PageCount:             pages,
		Data:                  results,
	}
	if len(results) == 0 {
		info.Data = []struct{}{}
	}
	return info, nil
}

func (f *WordFilter) mongoDBString() bson.M {
	// Start building the filter
	filter := bson.M{}

	// SpecificWords
	if len(f.SpecificWords) > 0 {
		filter["$or"] = []bson.M{
			{"alrihian": bson.M{"$in": f.SpecificWords}},
			{"latvian": bson.M{"$in": f.SpecificWords}},
		}

	}

	//// Order
	//TODO: make thing with $sort here
	//if f.Order == Abc {
	//	filter["order"] = "Abc"
	//} else if f.Order == Zxy {
	//	filter["order"] = "Zxy"
	//}

	// WordsPerPage
	//if f.WordsPerPage > 0 {
	//	filter["wordsperpage"] = f.WordsPerPage
	//}

	// PartOfSpeech
	if len(f.PartOfSpeech) > 0 {
		filter["partofspeech"] = bson.M{"$in": f.PartOfSpeech}
	}

	// StartsWith
	if f.StartsWith != "" {
		filter["$or"] = []bson.M{
			{"alrihian": primitive.Regex{Pattern: "^" + f.StartsWith, Options: ""}},
			{"latvian": primitive.Regex{Pattern: "^" + f.StartsWith, Options: ""}},
		}
	}

	// EndsWith
	if f.EndsWith != "" {
		filter["$or"] = []bson.M{
			{"alrihian": primitive.Regex{Pattern: f.EndsWith + "$", Options: ""}},
			{"latvian": primitive.Regex{Pattern: f.EndsWith + "$", Options: ""}},
		}
	}
	// Contains
	if f.Contains != "" {
		filter["$or"] = []bson.M{
			{"alrihian": primitive.Regex{Pattern: f.Contains, Options: "i"}},
			{"latvian": primitive.Regex{Pattern: f.Contains, Options: "i"}},
		}
	}

	return filter
}
func (f *WordFilter) SpecificWord() {
	//config.WordDB.Collection(config.WordData).Find(context.TODO(),)
}
