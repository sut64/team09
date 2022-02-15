package controller

import (
	"net/http"
	"strconv"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/tzcap/prescription/entity"
)

// POST /Prescriptions
func CreatePrescription(c *gin.Context) {

	var prescription entity.Prescription
	var authority entity.Authorities
	var disbursement entity.MedicineDisbursement
	var paymentStatus entity.PaymentStatus

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร prescription
	if err := c.ShouldBindJSON(&prescription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา authority ด้วย id
	if tx := entity.DB().Where("id = ?", prescription.AuthoritiesID).First(&authority); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "authority not found"})
		return
	}
	
	// 10: ค้นหา payment status ด้วย id
	if tx := entity.DB().Where("id = ?", prescription.PaymentStatusID).First(&paymentStatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment status not found"})
		return
	}

	// 11: ค้นหา medicine disbursement ด้วย id ใบเบิกยา
	if tx := entity.DB().Where("id = ?", prescription.MedicineDisbursementID).First(&disbursement); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}

	// 12: สร้าง Prescription
	prescript := entity.Prescription{
		PatientName:          prescription.PatientName,    // ตั้งค่าฟิลด์ PatientName
		PrescriptionNo:       prescription.PrescriptionNo, // ตั้งค่าฟิลด์ PrescriptionNo
		Authorities:          authority,                   // โยงความสัมพันธ์กับ Entity Authorities
		MedicineDisbursement: disbursement,                // โยงความสัมพันธ์กับ Entity MedicineDisbursement
		Amount:               prescription.Amount,         // ตั้งค่าฟิลด์ Amount
		PaymentStatus:        paymentStatus,               // โยงความสัมพันธ์กับ Entity PaymentStatus
		RecordingTime:        prescription.RecordingTime,  // ตั้งค่าฟิลด์ RecordingTime
	}

	// validate Prescription controller
	if _, err := govalidator.ValidateStruct(prescript); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 13: บันทึก
	if err := entity.DB().Create(&prescript).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": prescript})
}

// GET /Prescription/:id
func GetPrescription(c *gin.Context) {
	var prescription entity.Prescription
	id := c.Param("id")
	if err := entity.DB().Preload("Authorities").Preload("MedicineDisbursement").Preload("MedicineDisbursement.MedicineStorage").Preload("PaymentStatus").Raw("SELECT * FROM prescriptions WHERE id = ?", id).Find(&prescription).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": prescription})
}

// ใช้สำหรับการค้นหาเลขใบสั่งยาย้อนหลังโดยการพิมพ์เลขใบสั่งยาที่ search field
// GET /PrescriptionSearch/:id
func GetPrescriptionSearch(c *gin.Context) {
	var prescription []entity.Prescription
	id := c.Param("id")
	var query string
	number, _ := strconv.ParseInt(id, 0, 32)
	if number > 0 {
		query = "SELECT * FROM prescriptions WHERE prescription_no LIKE '" + id + "%'"
	} else {
		query = "SELECT * FROM prescriptions"
	}
	if err := entity.DB().Preload("Authorities").Preload("MedicineDisbursement").Preload("MedicineDisbursement.MedicineStorage").Preload("MedicineDisbursement.MedicineRoom").Preload("PaymentStatus").Raw(query).Find(&prescription).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": prescription})
}

// GET /Prescriptions
func ListPrescriptions(c *gin.Context) {
	var prescriptions []entity.Prescription
	if err := entity.DB().Preload("Authorities").Preload("MedicineDisbursement").Preload("MedicineDisbursement.MedicineStorage").Preload("MedicineDisbursement.MedicineRoom").Preload("PaymentStatus").Raw("SELECT * FROM prescriptions").Find(&prescriptions).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": prescriptions})
}

// DELETE /Prescriptions/:id
func DeletePrescription(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM prescriptions WHERE prescription_no = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prescription not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /Prescriptions
func UpdatePrescription(c *gin.Context) {
	var prescription entity.Prescription
	if err := c.ShouldBindJSON(&prescription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", prescription.ID).First(&prescription); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prescription not found"})
		return
	}

	if err := entity.DB().Save(&prescription).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": prescription})
}
