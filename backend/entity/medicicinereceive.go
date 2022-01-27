package entity

import (
	"time"

	// "github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type MedicineStorage struct {
	gorm.Model
	Name                  string
	Count                 int
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
	Company       string
	Count         int `valid:"IsNonNegative~Count must be Positive"`
	Price_of_unit float64

	AuthoritiesID *uint
	Authorities   Authorities `gorm:"references:id"`

	PackingID *uint
	Packing   Packing `gorm:"references:id"`

	ReceiveTypeID *uint
	ReceiveType   ReceiveType `gorm:"references:id"`

	MedicineStorageID *uint
	MedicineStorage   MedicineStorage `gorm:"references:id"`
}
