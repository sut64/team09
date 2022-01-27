package controller

import (
	"github.com/tzcap/prescription/entity"
	"github.com/gin-gonic/gin"
	"net/http"
)

// POST /cases
func CreateBill(c *gin.Context) {

	var bills entity.Bill
	var dispenseMedicines entity.DispenseMedicine
	var prices entity.Price
	var paymentmethods entity.Paymentmethod
	var authority entity.Authorities

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 9 จะถูก bind เข้าตัวแปร bill
	if err := c.ShouldBindJSON(&bills); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 10: ค้นหา characteristic ด้วย id
	if tx := entity.DB().Where("id = ?", bills.DispenseMedicineID).First(&dispenseMedicines); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dispense_medicines not found"})
		return
	}

	// 11: ค้นหา price ด้วย id
	if tx := entity.DB().Where("id = ?", bills.PriceID).First(&prices); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prices not found"})
		return
	}

	// 12: ค้นหา paymentmethod ด้วย id
	if tx := entity.DB().Where("id = ?", bills.PaymentmethodID).First(&paymentmethods); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymentmethods not found"})
		return
	}

	// 13: ค้นหา informer ด้วย id
	if tx := entity.DB().Where("id = ?", bills.AuthoritiesID).First(&authority); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "authorities not found"})
		return
	}

	// 14: สร้าง Bill
	bi := entity.Bill{
		DispenseMedicine: dispenseMedicines, // โยงความสัมพันธ์กับ Entity DispenseMedicine
		Price:            prices,            // โยงความสัมพันธ์กับ Entity Price
		Paymentmethod:    paymentmethods,    // โยงความสัมพันธ์กับ Entity Paymentmethod
		Authorities:        authority,         // โยงความสัมพันธ์กับ Entity Authority
		BillTime:         bills.BillTime,    // ตั้งค่าฟิลด์ BillTime
		BillNo:           bills.BillNo,      // ตั้งค่าฟิลด์ BillNo
		Payer:            bills.Payer,       // ตั้งค่าฟิลด์ Payer
		Total:            bills.Total,       // ตั้งค่าฟิลด์ Total
	}

	// 15: บันทึก
	if err := entity.DB().Create(&bi).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bi})
}

// GET /bill/:id
func GetBill(c *gin.Context) {
	var bills entity.Bill
	id := c.Param("id")
	if err := entity.DB().Preload("DispenseMedicine").Preload("Price").Preload("Paymentmethod").Preload("Authorities").Raw("SELECT * FROM bills WHERE id = ?", id).Find(&bills).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bills})
}

// GET /bills
func ListBill(c *gin.Context) {
	var bills []entity.Bill
	if err := entity.DB().Preload("DispenseMedicine").Preload("Price").Preload("Paymentmethod").Preload("Authorities").Raw("SELECT * FROM bills").Find(&bills).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bills})
}

// DELETE /bills/:id
func DeleteBill(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM bills WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bill not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /bills
func UpdateBill(c *gin.Context) {
	var bills entity.Bill
	if err := c.ShouldBindJSON(&bills); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", bills.ID).First(&bills); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bills not found"})
		return
	}

	if err := entity.DB().Save(&bills).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bills})
}
