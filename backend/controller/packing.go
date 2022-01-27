package controller

import (
	"github.com/tzcap/prescription/entity"
	"github.com/gin-gonic/gin"
	"net/http"
)

// GET /Packing/:id
func GetPacking(c *gin.Context) {
	var packing entity.Packing
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM packings WHERE id = ?", id).Scan(&packing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": packing})
}

// GET /Packing
func ListPacking(c *gin.Context) {
	var packing []entity.Packing
	if err := entity.DB().Raw("SELECT * FROM packings").Scan(&packing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": packing})
}
