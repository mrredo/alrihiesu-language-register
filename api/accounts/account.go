package accounts

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"main/functions"
	"main/structs"
	"net/url"
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
	c.JSON(200, acc.Get())
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

type AccFilters struct {
	ID   []string `json:"id"`
	Name []string `json:"name"`
}

// AccFilters is the struct meant for this api request
func GetAccountV2(c *gin.Context) {
	data := &AccFilters{}
	d := c.Query("data")
	qMarshal := false

	if d != "" {
		jsonD, _ := url.QueryUnescape(d)
		if err := json.Unmarshal([]byte(jsonD), data); err != nil {
			c.JSON(400, functions.Error("invalid_json"))
			return
		}
		qMarshal = true
	}

	if !qMarshal {
		if err := c.BindJSON(data); err != nil {
			c.JSON(400, functions.Error("invalid_json"))
			return
		}
	}

	fmt.Println(data)

	filter := bson.M{}
	filter["$or"] = []bson.M{}

	if len(data.Name) != 0 {
		filter["$or"] = append(filter["$or"].([]bson.M), bson.M{"name": bson.M{"$in": data.Name}})
	} else if len(data.ID) != 0 {
		filter["$or"] = append(filter["$or"].([]bson.M), bson.M{"id": bson.M{"$in": data.ID}})
	}

	datas, err := structs.GetAccount(filter)
	fmt.Println(err)

	if err != nil {
		c.JSON(404, functions.Error("not_found"))
		return
	}
	if len(datas) == 0 {
		c.JSON(200, []struct{}{})
		return
	}
	c.JSON(200, datas)
}
