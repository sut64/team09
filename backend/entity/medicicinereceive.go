package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Authority struct {
	gorm.Model
	Name  string
	Email string `gorm:"uniqueIndex"`
	Tell  string
	//โยง Medicine_receive
	Medicinereceives []Medicinereceive `gorm:"foreignKey:AuthorityID"`
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

type Medicinestorage struct {
	gorm.Model
	Name             string
	Count            int
	Medicinereceives []Medicinereceive `gorm:"foreignKey:MedicinestorageID"`

	MedicinetypeID *uint
	Medicinetype   Medicinetype `gorm:"references:id"`
}

type Medicinetype struct {
	gorm.Model
	Name             string
	Medicinestorages []Medicinestorage `gorm:"foreignKey:MedicinetypeID"`
}
type Medicinereceive struct {
	gorm.Model
	Receiveddate  time.Time
	Expire        time.Time
	Company       string
	Count         int `valid:"Positivenumber~Count must be Positive"`
	Price_of_unit float64

	AuthorityID *uint
	Authority   Authority `gorm:"references:id"`

	PackingID *uint
	Packing   Packing `gorm:"references:id"`

	ReceiveTypeID *uint
	ReceiveType   ReceiveType `gorm:"references:id"`

	MedicinestorageID *uint
	Medicinestorage   Medicinestorage `gorm:"references:id"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("Positivenumber", func(i interface{}, context interface{}) bool {
		t := i.(int)
		if t <= 1 {
			return false
		} else {
			return true
		}

	})

}
