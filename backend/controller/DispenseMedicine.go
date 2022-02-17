package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/tzcap/prescription/entity"
)

// POST /dispensemedicine
func CreateDispense_Medicine(c *gin.Context) {

	var dispense_medicine entity.DispenseMedicine
	var dispense_status entity.DispenseStatus
	var bill entity.Bill
	var authority entity.Authorities

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร dispensemedicine
	if err := c.ShouldBindJSON(&dispense_medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	/* // 9: ค้นหา medicinelabel ด้วย id
	if tx := entity.DB().Where("id = ?", dispense_medicine.MedicineLabelID).First(&medicine_label); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine_label not found"})
		return
	} */

	// 10: ค้นหา dispense_status ด้วย id
	if tx := entity.DB().Where("id = ?", dispense_medicine.DispenseStatusID).First(&dispense_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dispense_statuses not found"})
		return
	}

	// 11: ค้นหา bill ด้วย id
	if tx := entity.DB().Where("id = ?", dispense_medicine.BillID).First(&bill); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bills not found"})
		return
	}

	// 13: ค้นหา authorities ด้วย id
	if tx := entity.DB().Where("id = ?", dispense_medicine.AuthoritiesID).First(&authority); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "authorities not found"})
		return
	}

	// 12: สร้าง DispenseMedicine
	dispense := entity.DispenseMedicine{
		DispenseStatus:     dispense_status, // โยงความสัมพันธ์กับ Entity Dispense_status
		Bill:               bill,            // โยงความสัมพันธ์กับ Entity Bill
		Authorities:        authority,       // โยงความสัมพันธ์กับ Entity Authority
		DispensemedicineNo: dispense_medicine.DispensemedicineNo,
		ReceiveName:        dispense_medicine.ReceiveName,
		DispenseTime:       dispense_medicine.DispenseTime, // ตั้งค่าฟิลด์ watchedTime
	}

	// validate Prescription controller
	if _, err := govalidator.ValidateStruct(dispense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 13: บันทึก
	if err := entity.DB().Create(&dispense).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": dispense})
}

// GET /dispense_medicines/:id
func GetDispense_Medicine(c *gin.Context) {
	var dispense_medicines entity.DispenseMedicine
	id := c.Param("id")
	if err := entity.DB().Preload("Authorities").Preload("DispenseStatus").Preload("Bill").Raw("SELECT * FROM dispense_medicines WHERE id = ?", id).Find(&dispense_medicines).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": dispense_medicines})
}

// GET /dispense_medicines
func ListDispense_Medicine(c *gin.Context) {
	var dispense_medicines []entity.DispenseMedicine
	if err := entity.DB().Preload("Authorities").Preload("DispenseStatus").Preload("Bill").Raw("SELECT * FROM dispense_medicines ORDER BY dispensemedicine_no").Find(&dispense_medicines).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dispense_medicines})
}

/* // GET /bills
func ListBillNotBlank(c *gin.Context) {
	var bills []entity.Bill
	if err := entity.DB().Preload("Prescription").Preload("Prescription.MedicineDisbursement").
		Preload("Prescription.MedicineDisbursement.MedicineStorage").Preload("Paymentmethod").
		Preload("Authorities").Raw("SELECT * FROM dispense_medicines as d INNER JOIN bills as b ON b.id != d.bill_id AND d.dispense_status_id = 1").Find(&bills).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bills})
} */

/* // GET /BillPaymentStatus
func ListBillPaymentStatus(c *gin.Context) {
	var bills []entity.Bill
	if err := entity.DB().Preload("Authorities").Preload("DispenseStatus").Preload("Bill").Raw("SELECT * FROM bills,dispense_medicines WHERE dispense_medicines.bill_id != bills.id ORDER BY bill_no").Find(&bills).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bills})
} */

// DELETE /dispense_medicines/:id
func DeleteDispense_Medicine(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM dispense_medicines WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dispense_medicines not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /dispense_medicines
func UpdateDispense_Medicine(c *gin.Context) {
	var dispense_medicines entity.DispenseMedicine
	if err := c.ShouldBindJSON(&dispense_medicines); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", dispense_medicines.ID).First(&dispense_medicines); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dispense_medicines not found"})
		return
	}

	if err := entity.DB().Save(&dispense_medicines).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dispense_medicines})
}
