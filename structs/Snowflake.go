package structs

import (
	"errors"
	"github.com/bwmarrin/snowflake"
)

type Snowflake string

func GenerateId(nodeNum int64) (Snowflake, error) {
	node, err := snowflake.NewNode(nodeNum)
	if err != nil {
		return "", errors.New("failed generating id")
	}
	return Snowflake(node.Generate().String()), nil
}
