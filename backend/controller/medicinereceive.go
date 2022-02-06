package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/tzcap/prescription/entity"
)

// GET /Medicinereceive/:id
func GetMedicinereceive(c *gin.Context) {
	var medicinereceive entity.Medicinereceive
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM medicinereceives WHERE id = ?", id).Scan(&medicinereceive).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicinereceive})
}

// GET /Medicinereceive
func ListMedicinereceive(c *gin.Context) {
	var medicinereceive []entity.Medicinereceive
	if err := entity.DB().Preload("Packing").Preload("Authorities").Preload("ReceiveType").Preload("MedicineStorage").Preload("MedicineStorage.MedicineType").Raw("SELECT * FROM medicinereceives").Find(&medicinereceive).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicinereceive})
}

func CreateMedicinereceive(c *gin.Context) {

	var medicinereceive entity.Medicinereceive
	var packing entity.Packing
	var receive entity.ReceiveType
	var medicinestorage entity.MedicineStorage
	var authority entity.Authorities

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 9 จะถูก bind เข้าตัวแปร tenant
	if err := c.ShouldBindJSON(&medicinereceive); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 10: ค้นหา authority ด้วย id
	if tx := entity.DB().Where("id = ?", medicinereceive.AuthoritiesID).First(&authority); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "authority not found"})
		return
	}

	// 11: ค้นหา packing ด้วย id
	if tx := entity.DB().Where("id = ?", medicinereceive.PackingID).First(&packing); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "packing not found"})
		return
	}

	// 12: ค้นหา receive ด้วย id
	if tx := entity.DB().Where("id = ?", medicinereceive.ReceiveTypeID).First(&receive); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "receive not found"})
		return
	}

	// 13: ค้นหา medicinestorage ด้วย id
	if tx := entity.DB().Where("id = ?", medicinereceive.MedicineStorageID).First(&medicinestorage); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicinestorage not found"})
		return
	}
	// 14: อัพเดทค่า count
	if tx := entity.DB().Model(&medicinestorage).Where("id = ?", medicinereceive.MedicineStorageID).Update("Count", medicinestorage.Count+medicinereceive.Count); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "count not update"})
		return
	}

	// 15: สร้าง tenant
	medr := entity.Medicinereceive{
		Packing:         packing,
		ReceiveType:     receive,
		MedicineStorage: medicinestorage,
		Authorities:     authority,
		Company:         medicinereceive.Company,
		Count:           medicinereceive.Count,
		Price_of_unit:   medicinereceive.Price_of_unit,
		Expire:          medicinereceive.Expire,
		Receiveddate:    medicinereceive.Receiveddate,
	}
	//ขี้นตอนการ validation ที่นำมาจาก unit test
	if _, err := govalidator.ValidateStruct(medr); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 16: บันทึก
	if err := entity.DB().Create(&medr).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medr})

}
