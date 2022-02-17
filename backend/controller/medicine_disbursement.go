package controller

import (
	"net/http"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/tzcap/prescription/entity"
)

// POST /Medicine_disbursement
func CreateMedicine_disbursement(c *gin.Context) {

	var med entity.MedicineDisbursement
	var medicineroom entity.MedicineRoom
	var authoritiy entity.Authorities
	var medicinestorage entity.MedicineStorage

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร med
	if err := c.ShouldBindJSON(&med); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//10: ค้นหา Authoritiy ด้วย id
	if tx := entity.DB().Where("id = ?", med.AuthoritiesID).First(&authoritiy); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Authoritiy not found"})
		return
	}

	// 11: ค้นหา Medicinestorage ด้วย id
	if tx := entity.DB().Where("id = ?", med.MedicineStorageID).First(&medicinestorage); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicinestorage not found"})
		return
	}

	//12: ค้นหา medicineroom ด้วย id
	if tx := entity.DB().Where("id = ?", med.MedicineRoomID).First(&medicineroom); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicineroom not found"})
		return
	}
	

	//13: สร้าง Medicine_disbursement
	MD := entity.MedicineDisbursement{
		DisbursementID:  med.DisbursementID,  //ตั้งค่าฟิลด์ DisbursementID
		DisbursementDAY: med.DisbursementDAY, //ตั้งค่าฟิลด์ DisbursementDAY
		AmountMedicine:  med.AmountMedicine,  //ตั้งค่าฟิลด์ AmountMedicine
		Authorities:     authoritiy,          // โยงความสัมพันธ์กับ Entity authoritiy
		MedicineStorage: medicinestorage,     // โยงความสัมพันธ์กับ Entity medicinestorage
		MedicineRoom:    medicineroom,        // โยงความสัมพันธ์กับ Entity medicineroom
		
	}

	//Validate
	if _,err := govalidator.ValidateStruct(MD); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//14: บันทึก
	if err := entity.DB().Create(&MD).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": MD})

	//update count
	if tx := entity.DB().Model(&medicinestorage).Where("id = ?", med.MedicineStorageID).Update("count",(uint(medicinestorage.Count)-med.AmountMedicine)); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicinestorage not found"})
		return
	}

}

// GET /Medicine_disbursement/:id
func GetMedicine_disbursement(c *gin.Context) {
	var med entity.MedicineDisbursement
	id := c.Param("id")
	if err := entity.DB().Preload("Authorities").Preload("MedicineRoom").Preload("MedicineStorage").Raw("SELECT * FROM medicine_disbursements WHERE id = ?", id).Find(&med).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": med})
}

// GET /medicines/:id
func GetMedicineFromMedicineRoom(c *gin.Context) {
	var med []entity.MedicineDisbursement
	id := c.Param("id")
	if err := entity.DB().Preload("Authorities").Preload("MedicineRoom").Preload("MedicineStorage").Raw("SELECT * FROM medicine_disbursements WHERE medicine_room_id = ? GROUP BY medicine_storage_id", id).Find(&med).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": med})
}

// GET /listMedicine
func GetListMedicine(c *gin.Context) {
	var meds []entity.MedicineDisbursement
	if err := entity.DB().Preload("Authorities").Preload("MedicineRoom").Preload("MedicineStorage").Preload("MedicineStorage.MedicineType").Raw("SELECT * FROM medicine_disbursements GROUP BY medicine_storage_id").Find(&meds).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": meds})
}

// GET /Medicine_disbursement
func ListMedicine_disbursement(c *gin.Context) {
	var meds []entity.MedicineDisbursement
	if err := entity.DB().Preload("Authorities").Preload("MedicineRoom").Preload("MedicineStorage").Preload("MedicineStorage.MedicineType").Raw("SELECT * FROM medicine_disbursements").Find(&meds).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": meds})
}

// DELETE /Medicine_disbursement/:id
func DeleteMedicine_disbursement(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicine_disbursements WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Medicine_disbursement not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /Medicine_disbursement
func UpdateMedicine_disbursement(c *gin.Context) {
	var med entity.MedicineDisbursement
	if err := c.ShouldBindJSON(&med); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", med.ID).First(&med); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Medicine_disbursement not found"})
		return
	}

	if err := entity.DB().Save(&med).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": med})
}
