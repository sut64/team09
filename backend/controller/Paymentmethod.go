package controller

import (
	"github.com/tzcap/prescription/entity"
	"github.com/gin-gonic/gin"
	"net/http"
)

// POST /paymentmethods
func CreatePaymentmethod(c *gin.Context) {
	var paymentmethods entity.Paymentmethod
	if err := c.ShouldBindJSON(&paymentmethods); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&paymentmethods).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": paymentmethods})
}

// GET /price/:id
func GetPaymentmethod(c *gin.Context) {
	var paymentmethods entity.Paymentmethod
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM paymentmethods WHERE id = ?", id).Scan(&paymentmethods).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymentmethods})
}

// GET /paymentmethods
func ListPaymentmethod(c *gin.Context) {
	var paymentmethods []entity.Paymentmethod
	if err := entity.DB().Raw("SELECT * FROM paymentmethods").Scan(&paymentmethods).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymentmethods})
}

// DELETE /paymentmethods/:id
func DeletePaymentmethod(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM paymentmethods WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymentmethods not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /paymentmethods
func UpdatePaymentmethod(c *gin.Context) {
	var paymentmethods entity.Paymentmethod
	if err := c.ShouldBindJSON(&paymentmethods); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", paymentmethods.ID).First(&paymentmethods); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymentmethods not found"})
		return
	}

	if err := entity.DB().Save(&paymentmethods).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymentmethods})
}
