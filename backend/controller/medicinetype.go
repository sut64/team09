package controller
import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tzcap/prescription/entity"
)
// POST /MedicineType
func CreateMedicineType (c *gin.Context) {
	var medicinetype entity.MedicineType 
	if err := c.ShouldBindJSON(&medicinetype); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return

	}
	if err := entity.DB().Create(&medicinetype).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicinetype})
}
// GET /MedicineType /:id
func GetMedicineType (c *gin.Context) {
	var medicinetype entity.MedicineType 
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM medicine_types WHERE id = ?", id).Scan(&medicinetype).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicinetype})
}
// GET /MedicineType 
func ListMedicineType (c *gin.Context) {
	var medicinetype []entity.MedicineType 
	if err := entity.DB().Raw("SELECT * FROM medicine_types").Scan(&medicinetype).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicinetype})
}
// DELETE /MedicineType /:id
func DeleteMedicineType (c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicine_types WHERE id = ?", id); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "medicinetype not found"})
			return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}
// PATCH /MedicineType 
func UpdateMedicineType (c *gin.Context) {
	var medicinetype entity.MedicineType 
	if err := c.ShouldBindJSON(&medicinetype); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}
	if tx := entity.DB().Where("id = ?", medicinetype.ID).First(&medicinetype); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "medicinetype not found"})
			return
	}
	if err := entity.DB().Save(&medicinetype).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicinetype})
}
