package entity

import (
	"time"

	"gorm.io/gorm"
)

type MedicineStorage struct {
	gorm.Model
	Name                  string
	Count                 uint
	sell                  float64
	MedicineTypeID        *uint
	MedicineType          MedicineType           `gorm:"references:id"`
	MedicineDisbursements []MedicineDisbursement `gorm:"foreignKey:MedicineStorageID"`
	Medicinereceives      []Medicinereceive      `gorm:"foreignKey:MedicineStorageID"`
}
type Packing struct {
	gorm.Model
	Name             string
	Medicinereceives []Medicinereceive `gorm:"foreignKey:PackingID"`
}

type ReceiveType struct {
	gorm.Model
	Name             string
	Medicinereceives []Medicinereceive `gorm:"foreignKey:ReceiveTypeID"`
}

type MedicineType struct {
	gorm.Model
	Name             string
	MedicineStorages []MedicineStorage `gorm:"foreignKey:MedicineTypeID"`
}
type Medicinereceive struct {
	gorm.Model
	Receiveddate  time.Time
	Expire        time.Time
	Company       string  `valid:"required~fill not null"`
	Count         uint    `valid:"required~Count must be Positive"`
	Price_of_unit float64 `valid:"PriceBepositive~Price must be Positive"`

	AuthoritiesID *uint
	Authorities   Authorities `gorm:"references:id"`

	PackingID *uint
	Packing   Packing `gorm:"references:id"`

	ReceiveTypeID *uint
	ReceiveType   ReceiveType `gorm:"references:id"`

	MedicineStorageID *uint
	MedicineStorage   MedicineStorage `gorm:"references:id"`
}

// func init() {
// 	govalidator.CustomTypeTagMap.Set("PriceBepositive", func(i interface{}, context interface{}) bool {
// 		t := i.(float64)
// 		var y = math.Mod(t, 1)
// 		y = y * 100
// 		y = math.Mod(y, 1)
// 		if y > 0 {
// 			return false
// 		} else if t > 0 {
// 			return true
// 		} else {
// 			return false
// 		}

// 	})

// }
