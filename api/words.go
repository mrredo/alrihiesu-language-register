package api

import (
	"github.com/gin-gonic/gin"
	"main/structs"
	"strconv"
	"strings"
)

func GetWords(c *gin.Context) {
	page := c.Query("p")
	filter := &structs.WordFilter{}
	if err := c.BindJSON(filter); err != nil {
		c.JSON(400, Error("invalid json | err: "+err.Error()))
		return
	}
	pageNum := 1
	if page != "" {
		i, err := strconv.Atoi(page)
		if err == nil && i > 0 {
			pageNum = i
		}
	}
	list, err := filter.Exec(pageNum)
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
	word, err := structs.NewWord(word)
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

	if err := word.Update(); err != nil {
		c.JSON(400, Error(err.Error()))
		return
	}
}
