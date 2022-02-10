package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/tzcap/prescription/entity"
)

// POST /ambulances
func CreateMedicineLabel(c *gin.Context) {
	var medicineLabel entity.MedicineLabel
	var medicine entity.MedicineDisbursement
	var effect entity.Effect
	var suggestion entity.Suggestion
	var authority entity.Authorities
	//เช็คว่าตรงกันมั้ย
	if err := c.ShouldBindJSON(&medicineLabel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//  ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", medicineLabel.AuthoritiesID).First(&authority); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}
	// 8: ค้นหา ambulancetype ด้วย id
	if tx := entity.DB().Where("id = ?", medicineLabel.MedicineDisbursementID).First(&medicine); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}
	// 9: ค้นหา brand ด้วย id
	if tx := entity.DB().Where("id = ?", medicineLabel.EffectID).First(&effect); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "side effect not found"})
		return
	}
	// 10: ค้นหา status ด้วย id
	if tx := entity.DB().Where("id = ?", medicineLabel.SuggestionID).First(&suggestion); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "suggestion not found"})
		return
	}
	// 11: สร้าง Ambulance
	wv := entity.MedicineLabel{
		Instruction:          medicineLabel.Instruction,
		Property:             medicineLabel.Property,
		Consumption:          medicineLabel.Consumption,
		Date:                 medicineLabel.Date,
		Authorities:          authority,
		MedicineDisbursement: medicine,
		Suggestion:           suggestion,
		Effect:               effect,
	}
	if _, err := govalidator.ValidateStruct(wv); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 12: บันทึก
	if err := entity.DB().Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": wv})
}

// GET /ambulance/:id
func GetMedicineLabel(c *gin.Context) {
	var medicineLabel entity.MedicineLabel
	id := c.Param("id")
	if err := entity.DB().Preload("MedicineDisbursement").Preload("MedicineDisbursement.MedicineStorage").Preload("Suggestion").Preload("Effect").Preload("Authorities").Raw("SELECT * FROM medicine_labels WHERE id = ?", id).Find(&medicineLabel).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineLabel})
}

// GET /ambulances
func ListMedicineLabel(c *gin.Context) {
	var medicineLabels []entity.MedicineLabel
	if err := entity.DB().Preload("MedicineDisbursement").Preload("MedicineDisbursement.MedicineStorage").Preload("Suggestion").Preload("Effect").Preload("Authorities").Raw("SELECT * FROM medicine_labels").Find(&medicineLabels).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineLabels})
}

// DELETE /ambulances/:id
func DeleteMedicineLabel(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicine_labels WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ambulance not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /ambulances
func UpdateMedicineLabel(c *gin.Context) {
	var medicineLabel entity.MedicineLabel
	if err := c.ShouldBindJSON(&medicineLabel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", medicineLabel.ID).First(&medicineLabel); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ambulance not found"})
		return
	}
	if err := entity.DB().Save(&medicineLabel).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineLabel})
}
