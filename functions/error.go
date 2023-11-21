package functions

import "github.com/gin-gonic/gin"

func Error(s string) gin.H {
	return gin.H{"error": s}
}
func Success(s string) gin.H {
	return gin.H{"success": s}
}
