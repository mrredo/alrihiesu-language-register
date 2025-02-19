package api

import (
	"fmt"
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
	r.Use(func(c *gin.Context) {
		fmt.Println(c.Request.Header.Get("Origin"))
		c.Next()
	})
	r.Use(cors.New(cors.Config{
		AllowWildcard:          true,
		AllowWebSockets:        true,
		AllowBrowserExtensions: true,
		AllowOrigins: []string{
			"http://localhost:3000/",
			"http://localhost:4020/",
			"http://localhost:3000",
			"http://localhost:4020",
			"https://127.0.0.1:443/",
			"http://127.0.0.1:80/",
			"https://127.0.0.1:443",
			"http://127.0.0.1:80",
			"http://alriha.xyz/",
			"https://alriha.xyz/",
			"http://alriha.xyz",
			"https://alriha.xyz",
			"https://alrihiesu-language-register-1.mrredogaming.repl.co/",
			"https://alrihiesu-language-register-1.mrredogaming.repl.co",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "NEWGET", "NEW"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Accept", "Cookie", "Set-Cookie"},
		AllowCredentials: true,
	}))
	store := cookie.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("user", store))

	api := r.Group("/api/")
	acc := r.Group("/acc/")
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
	acc.GET("/account", accounts.GetAccountV2)
	acc.Handle("NEW", "/account", accounts.GetAccountV2)
	acc.POST("/account", accounts.CreateAccount)

}
