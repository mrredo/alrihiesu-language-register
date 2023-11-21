package config

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"os"
)

var (
	MongoClient *mongo.Client
	Server      *gin.Engine
	WordDB      *mongo.Database
	AccountDB   *mongo.Database

	GramDB *mongo.Database
)

const (
	AccountData = "account"
	WordData    = "words"
)
const (
	WordNode    = 1
	GramNode    = 2
	AccountNode = 3
)

func ValidAdminKey(key string) bool {
	return os.Getenv("ADMIN_KEY") == key
}
