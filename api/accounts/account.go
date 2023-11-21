package accounts

import (
	"github.com/gin-gonic/gin"
	"main/functions"
	"main/structs"
	"strings"
)

func CreateAccount(c *gin.Context) {
	data := &structs.Account{}
	if err := c.BindJSON(&data); err != nil {
		c.JSON(400, functions.Error("invalid_json"))
		return
	}
	adminKey := c.Query("key")
	acc, err := structs.CreateAccount(data.Name, data.Password, adminKey)
	if err != nil {
		c.JSON(400, functions.Error(err.Error()))
		return
	}
	acc.RemovePasswordField()
	c.JSON(200, *acc)
}
func GetAccount(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.JSON(400, functions.Error("missing_name_query"))
		return
	}
	acc, err := structs.RetrieveAccountData(strings.ToLower(name))
	if err != nil {
		c.JSON(400, functions.Error(err.Error()))
		return
	}
	c.JSON(200, acc)

}
