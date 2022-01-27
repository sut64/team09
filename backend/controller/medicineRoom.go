package controller
 
import (
	"github.com/tzcap/prescription/entity"
	"github.com/gin-gonic/gin"
	"net/http"
)

// POST /medicineRooms
func CreateMedicineRoom(c *gin.Context) {
	var medicine entity.MedicineRoom
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	if err := entity.DB().Create(&medicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicine})
}

// GET /medicineRoom/:id
func GetMedicineRoom(c *gin.Context) {
	var medicine entity.MedicineRoom
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM medicine_rooms WHERE id = ?", id).Scan(&medicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": medicine})
}

// GET /medicineRooms
func ListMedicineRooms(c *gin.Context) {
	var medicine []entity.MedicineRoom
	if err := entity.DB().Raw("SELECT * FROM medicine_rooms").Scan(&medicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": medicine})
}

// DELETE /medicineRooms/:id
func DeleteMedicineRoom(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicine_rooms WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /medicineRooms
func UpdateMedicineRoom(c *gin.Context) {
	var medicine entity.MedicineRoom
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	if tx := entity.DB().Where("id = ?", medicine.ID).First(&medicine); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}
 
	if err := entity.DB().Save(&medicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": medicine})
}
