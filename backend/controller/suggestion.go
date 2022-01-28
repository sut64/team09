package controller

import (
	"github.com/tzcap/prescription/entity"
	"github.com/gin-gonic/gin"
	"net/http"
)

// POST /AmbulanceType
func CreateSuggestion(c *gin.Context) {
	var suggestion entity.Suggestion
	if err := c.ShouldBindJSON(&suggestion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Create(&suggestion).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": suggestion})
}

// GET /Ambulancetype/:id
func GetSuggestion(c *gin.Context) {
	var suggestion entity.Suggestion
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM suggestions WHERE id = ?", id).Scan(&suggestion).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": suggestion})
}

// GET /AmbulanceTypes
func ListSuggestion(c *gin.Context) {
	var suggestions []entity.Suggestion
	if err := entity.DB().Raw("SELECT * FROM suggestions").Scan(&suggestions).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": suggestions})
}

// DELETE /ambulanceTypes/:id
func DeleteSuggestion(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM suggestions WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /ambulanceTypes
func UpdateSuggestion(c *gin.Context) {
	var suggestion entity.Suggestion
	if err := c.ShouldBindJSON(&suggestion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", suggestion.ID).First(&suggestion); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type not found"})
		return
	}
	if err := entity.DB().Save(&suggestion).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": suggestion})
}
