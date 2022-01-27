package controller

import (
	"net/http"

	"github.com/Hitmepls/project/entity"
	"github.com/gin-gonic/gin"
)

// GET /Authority/:id
func GetAuthority(c *gin.Context) {
	var authority entity.Authority
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM authorities WHERE id = ?", id).Scan(&authority).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": authority})
}

// GET /Authority
func ListAuthority(c *gin.Context) {
	var authority []entity.Authority
	if err := entity.DB().Raw("SELECT * FROM authorities").Scan(&authority).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": authority})
}
