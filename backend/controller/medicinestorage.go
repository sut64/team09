package controller
import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tzcap/prescription/entity"
)
// POST /MedicineStorage
func CreateMedicineStorage(c *gin.Context) {
	var medicinestorage entity.MedicineStorage
	if err := c.ShouldBindJSON(&medicinestorage); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return

	}
	if err := entity.DB().Create(&medicinestorage).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicinestorage})
}
// GET /MedicineStorage/:id
func GetMedicineStorage(c *gin.Context) {
	var medicinestorage entity.MedicineStorage
	id := c.Param("id")
	if err := entity.DB().Preload("MedicineType").Raw("SELECT * FROM medicine_storages WHERE id = ?", id).Find(&medicinestorage).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicinestorage})
}
// GET /MedicineStorage
func ListMedicineStorage(c *gin.Context) {
	var medicinestorage []entity.MedicineStorage
	if err := entity.DB().Preload("MedicineType").Raw("SELECT * FROM medicine_storages").Find(&medicinestorage).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicinestorage})
}
// DELETE /MedicineStorage/:id
func DeleteMedicineStorage(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicine_storages WHERE id = ?", id); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "medicinestorage not found"})
			return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}
// PATCH /MedicineStorage
func UpdateMedicineStorage(c *gin.Context) {
	var medicinestorage entity.MedicineStorage
	if err := c.ShouldBindJSON(&medicinestorage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}
	if tx := entity.DB().Where("id = ?", medicinestorage.ID).First(&medicinestorage); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "medicinestorage not found"})
			return
	}
	if err := entity.DB().Save(&medicinestorage).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicinestorage})
}
