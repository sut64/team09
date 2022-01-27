package controller

import (
	"net/http"

	"github.com/Hitmepls/project/entity"
	"github.com/gin-gonic/gin"
)

// GET /Medicinetype/:id
func GetMedicinetype(c *gin.Context) {
	var medicinetype entity.Medicinetype
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM medicinetypes WHERE id = ?", id).Scan(&medicinetype).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicinetype})
}

// GET /Medicinetype
func ListMedicinetype(c *gin.Context) {
	var medicinetype []entity.Medicinetype
	if err := entity.DB().Preload("medicinestorages").Raw("SELECT * FROM medicinetypes").Scan(&medicinetype).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicinetype})
}
