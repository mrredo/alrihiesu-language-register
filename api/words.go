package api

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"main/structs"
	"strings"
)

func GetWords(c *gin.Context) {
	filter := &structs.WordFilter{}
	if err := c.BindJSON(filter); err != nil {
		c.JSON(400, Error("invalid json | err: "+err.Error()))
		return
	}
	if filter.Page <= 0 {
		filter.Page = 1
	}
	list, err := filter.Exec(filter.Page)
	if err != nil {
		c.JSON(400, Error("failed getting words | err: "+err.Error()))
		return
	}

	c.JSON(200, list)

}
func MakeNewWord(c *gin.Context) {
	/*
		TODO: Make support for multiple words to be added at the same time.
	*/
	var word = &structs.Word{}
	if err := c.BindJSON(word); err != nil {
		c.JSON(400, Error("invalid json | err: "+err.Error()))
		return
	}
	if list := word.RequiredFields(); len(list) != 0 {
		c.JSON(400, Error("required fields that are empty: "+strings.Join(list, ", ")))

		return
	}
	b1 := structs.WordExistsUni("alrihian", word.Alrihian)
	if b1 {
		c.JSON(400, Error("word already exists"))
		return
	}
	if err := word.Fetch("alrihian", word.Alrihian); err != nil {
		c.JSON(400, Error(err.Error()))
		return
	}
	session := sessions.Default(c)
	data := session.Get("user").(string)
	word, err := structs.NewWord(word, structs.AccountData[data])
	if err != nil {
		c.JSON(400, Error(err.Error()))
		return
	}
	c.JSON(200, *word)
}
func DeleteWord(c *gin.Context) {
	var word = &structs.Word{}
	if err := c.BindJSON(word); err != nil {
		c.JSON(400, Error("invalid json | err: "+err.Error()))
		return
	}
	if b := structs.WordExists(word.ID); !b {
		c.JSON(400, Error("word doesn't exist, please create a new one"))
		return
	}
	if err := structs.RemoveWord(word.ID); err != nil {
		c.JSON(400, Error(err.Error()))
		return
	}

}
func UpdateWord(c *gin.Context) {

	var word = &structs.Word{}
	if err := c.BindJSON(word); err != nil {
		c.JSON(400, Error("invalid json | err: "+err.Error()))
		return
	}
	if b := structs.WordExists(word.ID); !b {
		c.JSON(400, Error("word doesn't exist, please create a new one"))
		return
	}

	if err := word.Update(sessions.Default(c).Get("user").(string)); err != nil {
		c.JSON(400, Error(err.Error()))
		return
	}
}
