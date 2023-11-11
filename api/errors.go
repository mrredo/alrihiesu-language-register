package api

import "github.com/gin-gonic/gin"

func Error(err string) gin.H {
	return gin.H{"error": err}
}
