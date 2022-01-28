package controller

import (
	"github.com/tzcap/prescription/entity"
	"github.com/gin-gonic/gin"
	"net/http"
)

// POST /videos
func CreateDispense_status(c *gin.Context) {
	var dispense_statuses entity.DispenseStatus
	if err := c.ShouldBindJSON(&dispense_statuses); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&dispense_statuses).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": dispense_statuses})
}

// GET /dispense_statuses/:id
func GetDispense_status(c *gin.Context) {
	var dispense_statuses entity.DispenseStatus

	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM dispense_statuses WHERE id = ?", id).Find(&dispense_statuses).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dispense_statuses})
}

// GET /dispense_statuses
func ListDispense_status(c *gin.Context) {
	var dispense_statuses []entity.DispenseStatus
	if err := entity.DB().Raw("SELECT * FROM dispense_statuses").Find(&dispense_statuses).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dispense_statuses})
}

// DELETE /dispense_statuses/:id
func DeleteDispense_status(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM dispense_statuses WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dispense_status not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /dispense_statuses
func UpdateDispense_status(c *gin.Context) {
	var dispense_statuses entity.DispenseStatus
	if err := c.ShouldBindJSON(&dispense_statuses); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", dispense_statuses.ID).First(&dispense_statuses); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dispense_status not found"})
		return
	}

	if err := entity.DB().Save(&dispense_statuses).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dispense_statuses})
}
