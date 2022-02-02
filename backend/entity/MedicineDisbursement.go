package entity

import (
	//"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
	"time"
)

type MedicineRoom struct {
	gorm.Model
	Name                  string                 `gorm:"uniqueIndex"`
	MedicineDisbursements []MedicineDisbursement `gorm:"foreignKey:MedicineRoomID"`
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
	MedicineRoom      MedicineRoom    `gorm:"references:id"`
	Prescriptions     []Prescription  `gorm:"foreignKey:MedicineDisbursementID"`
	MedicineLabels    []MedicineLabel `gorm:"foreignKey:MedicineDisbursementID"`
}
