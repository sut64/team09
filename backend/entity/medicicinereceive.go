package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type MedicineStorage struct {
	gorm.Model
	Name                  string
	Count                 uint
	Sell                  float64
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
	Receiveddate  time.Time `valid:"notpast~Receiveddate must be not past"`
	Expire        time.Time `valid:"notpast~Expire must be not past"`
	Company       string    `valid:"required~Company fill not null"`
	Count         uint      `valid:"required~Count must be Positive"`
	Price_of_unit float64   `valid:"required~Price must be Positive,PriceBepositive~Price must be Positive"`

	AuthoritiesID *uint
	Authorities   Authorities `gorm:"references:id" valid:"-"`

	PackingID *uint
	Packing   Packing `gorm:"references:id" valid:"-"`

	ReceiveTypeID *uint
	ReceiveType   ReceiveType `gorm:"references:id" valid:"-"`

	MedicineStorageID *uint
	MedicineStorage   MedicineStorage `gorm:"references:id" valid:"-"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("PriceBepositive", func(i interface{}, context interface{}) bool {
		t := i.(float64)

		if t > 0 {
			return true
		} else {
			return false
		}

	})

	govalidator.CustomTypeTagMap.Set("notpast",
		func(i interface{}, context interface{}) bool {

			t := i.(time.Time)
			return t.After(time.Now())
		})

}
