package controller

import (
	"github.com/tzcap/prescription/entity"
	"github.com/gin-gonic/gin"
	"net/http"
)

// POST /prices
func CreatePrice(c *gin.Context) {
	var prices entity.Price
	if err := c.ShouldBindJSON(&prices); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&prices).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": prices})
}

// GET /price/:id
func GetPrice(c *gin.Context) {
	var prices entity.Price
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM prices WHERE id = ?", id).Scan(&prices).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": prices})
}

// GET /prices
func ListPrice(c *gin.Context) {
	var prices []entity.Price
	if err := entity.DB().Raw("SELECT * FROM prices").Scan(&prices).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": prices})
}

// DELETE /prices/:id
func DeletePrice(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM prices WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prices not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /prices
func UpdatePrice(c *gin.Context) {
	var prices entity.Price
	if err := c.ShouldBindJSON(&prices); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", prices.ID).First(&prices); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prices not found"})
		return
	}

	if err := entity.DB().Save(&prices).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": prices})
}
