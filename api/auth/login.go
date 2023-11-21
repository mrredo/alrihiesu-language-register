package auth

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"main/functions"
	"main/structs"
	"reflect"
)

func Login(c *gin.Context) {
	acc := &structs.Account{}
	session := sessions.Default(c)
	if session.Get("user") != nil && reflect.TypeOf(session.Get("user")).Kind() == reflect.String {
		if b, ok := structs.AccountData[session.Get("user").(string)]; ok {
			c.JSON(200, b)
			return
		}
	}
	if err := c.BindJSON(acc); err != nil {
		c.JSON(400, functions.Error("invalid_json"))
		return
	}
	if !acc.Exists() {
		c.JSON(404, functions.Error("user_not_found"))
		return
	}
	if err := acc.Authenticate(acc.Password); err != nil {
		c.JSON(400, functions.Error(err.Error()))
		return
	}
	if err := acc.Fetch(); err != nil {
		c.JSON(400, functions.Error(err.Error()))
		return
	}
	strRand := functions.RandStringRunes(64)
	structs.AccountData[strRand] = *acc
	session.Set("user", strRand)
	if err := session.Save(); err != nil {
		c.JSON(400, functions.Error("failed_saving_session"))
		return
	}
	c.JSON(200, acc.Get())

}
func Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Delete("user")
	if err := session.Save(); err != nil {
		c.JSON(500, functions.Error("failed_saving_cookie"))
		return
	}
	c.Status(200)
}
func GetOwnAccount(c *gin.Context) {
	session := sessions.Default(c)
	if session.Get("user") == nil {
		c.JSON(400, functions.Error("not_authenticated"))
		return
	}
	if reflect.TypeOf(session.Get("user")).Kind() != reflect.String {
		session.Delete("user")
		if err := session.Save(); err != nil {
			c.JSON(500, functions.Error("failed_saving_cookie"))
			return
		}
		c.JSON(404, functions.Error(structs.ErrNotAuthenticated.Error()))
		return
	}
	if b, ok := structs.AccountData[session.Get("user").(string)]; ok {
		c.JSON(200, b)
		return
	}

	c.JSON(405, functions.Error(structs.ErrNotAuthenticated.Error()))

}
