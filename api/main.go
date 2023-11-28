package api

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"main/api/accounts"
	"main/api/auth"
	"main/config"
	"main/functions"
)

func RegisterEndpoints() {
	r := config.Server
	store := cookie.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("user", store))
	r.Use(cors.New(cors.Config{
		AllowWildcard:          true,
		AllowWebSockets:        true,
		AllowBrowserExtensions: true,
		AllowOrigins:           []string{"http://localhost:4000", "http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:4000", "https://127.0.0.1:443", "http://127.0.0.1:80", "http://192.168.8.114:4000", "https://redobot-golang-1.mrredogaming.repl.co"},
		AllowMethods:           []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "NEWGET"},
		AllowHeaders:           []string{"Origin", "Content-Length", "Content-Type", "Accept", "Cookie", "Set-Cookie"},
		AllowCredentials:       true,
	}))
	api := r.Group("/api/")
	authGr := r.Group("/auth/")
	api.Use(func(c *gin.Context) {
		session := sessions.Default(c)
		if session.Get("user") == nil && (c.Request.Method != "GET" && c.Request.Method != "NEWGET") {
			c.JSON(401, functions.Error("not_authenticated"))
			c.Abort()
		}
	})
	r.Static("/static/", "./frontend/build/static/")

	r.Static("/assets/", "./frontend/build")
	r.NoRoute(func(c *gin.Context) {
		c.File("./frontend/build/index.html")
	})

	// AUTHENTICATION
	authGr.POST("/logout", auth.Logout)

	authGr.POST("/login", auth.Login)
	authGr.GET("/account", auth.GetOwnAccount)

	// API
	// - WORDS
	api.PUT("/word", GetWords)
	api.Handle("NEWGET", "/word", GetWords)

	api.GET("/word", GetWords)
	api.POST("/word", MakeNewWord)
	api.DELETE("/word", DeleteWord)
	api.PATCH("/word", UpdateWord)

	// - ACCOUNT
	api.GET("/account", accounts.GetAccount)
	api.POST("/account", accounts.CreateAccount)
}
