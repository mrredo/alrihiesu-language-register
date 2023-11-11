package config

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	MongoClient *mongo.Client
	Server      *gin.Engine
	WordDB      *mongo.Database
	GramDB      *mongo.Database
)

const (
	WordData = "words"
)
const (
	WordNode = iota + 1
	GramNode
)
