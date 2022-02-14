package controller
 
import (
	"github.com/tzcap/prescription/entity"
	"github.com/gin-gonic/gin"
	"net/http"
)

// POST /paymentStatuses
func CreatePaymentStatus(c *gin.Context) {
	var paymentStatus entity.PaymentStatus
	if err := c.ShouldBindJSON(&paymentStatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	if err := entity.DB().Create(&paymentStatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": paymentStatus})
}

// GET /paymentStatus/:id
func GetPaymentStatus(c *gin.Context) {
	var paymentStatus entity.PaymentStatus
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM payment_statuses WHERE status = ?", id).Scan(&paymentStatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": paymentStatus})
}

// GET /paymentStatuses
func ListPaymentStatuses(c *gin.Context) {
	var paymentStatus []entity.PaymentStatus
	if err := entity.DB().Raw("SELECT * FROM payment_statuses").Scan(&paymentStatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": paymentStatus})
}

// DELETE /paymentStatuses/:id
func DeletePaymentStatus(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM payment_statuses WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymentStatus not found"})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /paymentStatuses
func UpdatePaymentStatus(c *gin.Context) {
	var paymentStatus entity.PaymentStatus
	if err := c.ShouldBindJSON(&paymentStatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	if tx := entity.DB().Where("id = ?", paymentStatus.ID).First(&paymentStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}
 
	if err := entity.DB().Save(&paymentStatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": paymentStatus})
}
