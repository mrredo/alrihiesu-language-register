package api

import (
	"github.com/gin-contrib/cors"
	"main/config"
)

func RegisterEndpoints() {
	r := config.Server
	r.Use(cors.New(cors.Config{
		AllowWildcard:          true,
		AllowWebSockets:        true,
		AllowBrowserExtensions: true,
		AllowOrigins:           []string{"http://localhost:4000", "http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:4000", "https://127.0.0.1:443", "http://127.0.0.1:80", "http://192.168.8.114:4000", "https://redobot-golang-1.mrredogaming.repl.co"},
		AllowMethods:           []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "PET"},
		AllowHeaders:           []string{"Origin", "Content-Length", "Content-Type", "Accept", "Cookie", "Set-Cookie"},
		AllowCredentials:       true,
	}))
	api := r.Group("/api/")
	api.PUT("/word", GetWords)
	api.GET("/word", GetWords)
	api.POST("/word", MakeNewWord)
	api.DELETE("/word", DeleteWord)
	api.PATCH("/word", UpdateWord)
}
