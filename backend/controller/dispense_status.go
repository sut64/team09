package controller

import (
	"github.com/tzcap/prescription/entity"
	"github.com/gin-gonic/gin"
	"net/http"
)

// POST /dispenseStatuses
func CreateDispenseStatus(c *gin.Context) {
	var dispenseStatus entity.DispenseStatus
	if err := c.ShouldBindJSON(&dispenseStatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&dispenseStatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": dispenseStatus})
}

// GET /dispenseStatus/:id
func GetDispenseStatus(c *gin.Context) {
	var dispenseStatus entity.DispenseStatus

	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM dispense_statuses WHERE status = ?", id).Find(&dispenseStatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dispenseStatus})
}

// GET /dispenseStatuses
func ListDispenseStatus(c *gin.Context) {
	var dispenseStatus []entity.DispenseStatus
	if err := entity.DB().Raw("SELECT * FROM dispense_statuses").Find(&dispenseStatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dispenseStatus})
}

// DELETE /dispenseStatuses/:id
func DeleteDispenseStatus(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM dispense_statuses WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dispenseStatus not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /dispenseStatuses
func UpdateDispenseStatus(c *gin.Context) {
	var dispenseStatus entity.DispenseStatus
	if err := c.ShouldBindJSON(&dispenseStatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", dispenseStatus.ID).First(&dispenseStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dispenseStatus not found"})
		return
	}

	if err := entity.DB().Save(&dispenseStatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dispenseStatus})
}
