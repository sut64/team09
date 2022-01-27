package controller

import (
	"net/http"

	"github.com/Hitmepls/project/entity"
	"github.com/gin-gonic/gin"
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
	if err := entity.DB().Raw("SELECT * FROM medicinereceives").Scan(&medicinereceive).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicinereceive})
}

func CreateMedicinereceive(c *gin.Context) {

	var medicinereceive entity.Medicinereceive
	var packing entity.Packing
	// var receive entity.Receive
	var medicinestorage entity.Medicinestorage
	var authority entity.Authority

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 11 จะถูก bind เข้าตัวแปร tenant
	if err := c.ShouldBindJSON(&medicinereceive); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 12: ค้นหา packing ด้วย id
	if tx := entity.DB().Where("id = ?", medicinereceive.PackingID).First(&packing); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prefix not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", medicinereceive.AuthorityID).First(&authority); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prefix not found"})
		return
	}

	// 13: ค้นหา receive ด้วย id
	// if tx := entity.DB().Where("id = ?", medicinereceive.ReceiveID).First(&receive); tx.RowsAffected == 0 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "career not found"})
	// 	return
	// }

	// 14: ค้นหา gender ด้วย id
	if tx := entity.DB().Where("id = ?", medicinereceive.MedicinestorageID).First(&medicinestorage); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "gender not found"})
		return
	}

	if tx := entity.DB().Model(&medicinestorage).Where("id = ?", medicinereceive.MedicinestorageID).Update("Count", medicinestorage.Count+medicinereceive.Count); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "gender not found"})
		return
	}

	//เซ็ด บัตรประชาชนเป็นรหัสผ่าน
	// password, err := bcrypt.GenerateFromPassword([]byte(tenant.Idcard), 14)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "error hashing password"})
	// 	return
	// }
	// if tenant.Idcard == "" {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "idcard is not null"})
	// 	return
	// }

	// 17: สร้าง tenant
	tn := entity.Medicinereceive{
		Packing: packing,
		// Receive:         receive,
		Medicinestorage: medicinestorage,
		Authority:       authority,
		Company:         medicinereceive.Company,
		Count:           medicinereceive.Count,
		Price_of_unit:   medicinereceive.Price_of_unit,
		Expire:          medicinereceive.Expire,
		Receiveddate:    medicinereceive.Receiveddate,
	}

	// 18: บันทึก
	if err := entity.DB().Create(&tn).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": tn})

}
