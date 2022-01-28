package controller

import (
	"github.com/tzcap/prescription/entity"
	"github.com/gin-gonic/gin"
	"net/http"
)

// POST /AmbulanceType
func CreateEffect(c *gin.Context) {
	var effect entity.Effect
	if err := c.ShouldBindJSON(&effect); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Create(&effect).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": effect})
}

// GET /Ambulancetype/:id
func GetEffect(c *gin.Context) {
	var effect entity.Effect
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM effects WHERE id = ?", id).Scan(&effect).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": effect})
}

// GET /AmbulanceTypes
func ListEffect(c *gin.Context) {
	var effects []entity.Effect
	if err := entity.DB().Raw("SELECT * FROM effects").Scan(&effects).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": effects})
}

// DELETE /ambulanceTypes/:id
func DeleteEffect(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM effects WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /ambulanceTypes
func UpdateEffect(c *gin.Context) {
	var effect entity.Effect
	if err := c.ShouldBindJSON(&effect); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", effect.ID).First(&effect); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type not found"})
		return
	}
	if err := entity.DB().Save(&effect).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": effect})
}
