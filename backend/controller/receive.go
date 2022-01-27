package controller

import (
	"net/http"

	"github.com/Hitmepls/project/entity"
	"github.com/gin-gonic/gin"
)

// GET /Receive/:id
func GetReceive(c *gin.Context) {
	var receive entity.ReceiveType
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM receives WHERE id = ?", id).Scan(&receive).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": receive})
}

// GET /Receive
func ListReceive(c *gin.Context) {
	var receive []entity.ReceiveType
	if err := entity.DB().Raw("SELECT * FROM receives").Scan(&receive).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": receive})
}
