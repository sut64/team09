package entity

import (
	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
	"time"
)

type MedicineRoom struct {
	gorm.Model
	Name                  string `gorm:"uniqueIndex"`
	Amount                uint
	Price                 float32
	MedicineDisbursements []MedicineDisbursement `gorm:"foreignKey:MedicineRoomID"`
	Prescriptions         []Prescription         `gorm:"foreignKey:MedicineRoomID"`
	MedicineLabels        []MedicineLabel        `gorm:"foreignKey:MedicineRoomID"`
}
type MedicineDisbursement struct {
	gorm.Model
	DisbursementID    string `valid:"matches(^[D]\\d{4}$)"`
	DisbursementDAY   time.Time
	AmountMedicine    uint
	AuthoritiesID     *uint
	Authorities       Authorities `gorm:"references:id"`
	MedicineStorageID *uint
	MedicineStorage   MedicineStorage `gorm:"references:id"`
	MedicineRoomID    *uint
	MedicineRoom      MedicineRoom `gorm:"references:id"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("past", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.Before(time.Now())
	})
}
