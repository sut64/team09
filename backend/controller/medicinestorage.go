package controller

import (
	"net/http"

	"github.com/Hitmepls/project/entity"
	"github.com/gin-gonic/gin"
)

// GET /Medicinestorage/:id
func GetMedicinestorage(c *gin.Context) {
	var medicinestorage entity.Medicinestorage
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM medicinestorages WHERE id = ?", id).Scan(&medicinestorage).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicinestorage})
}

// GET /Medicinetype
func ListMedicinestorage(c *gin.Context) {
	var medicinestorage []entity.Medicinestorage
	if err := entity.DB().Preload("medicinetypes").Raw("SELECT * FROM medicinestorages").Scan(&medicinestorage).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicinestorage})
}
