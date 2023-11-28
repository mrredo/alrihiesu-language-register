package main

import (
	"context"
	"encoding/gob"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"main/api"
	"main/config"
	"main/structs"
	"math/rand"
	"os"
	"time"
)

var (
	r = gin.Default()
)

func init() {
	rand.Seed(time.Now().UnixNano())
}
func main() {
	gob.Register(map[string]any{})
	gob.Register(structs.Account{})
	err := godotenv.Load()
	//if err != nil {
	//	log.Fatal("Error loading .env file")
	//}
	config.Server = r
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(os.Getenv("MONGO")).SetServerAPIOptions(serverAPI)
	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	config.MongoClient = client

	if err != nil {
		panic(err)
	}
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	config.WordDB = client.Database("word")
	config.AccountDB = client.Database(config.AccountData)
	config.GramDB = client.Database("grammatical")
	api.RegisterEndpoints()

	r.Run("localhost:4020")
}
