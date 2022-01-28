package entity

import (
	"time"

	"gorm.io/gorm"
)


type DispenseStatus struct {
	gorm.Model
	Status string

	DispenseMedicines []DispenseMedicine `gorm:"foreignKey:DispenseStatusID"`
}

type DispenseMedicine struct {
	gorm.Model
	DispensemedicineNo string `valid:"required~DispensemedicineNo cannot be blank, matches(^[H]\\d{4}$)"`
	Amount             uint
	DispenseTime       time.Time //`valid:"present~DispenseTime must be in the present"`

	// MedicineLabelID ทำหน้าที่เป็น FK
	MedicineLabelID *uint
	MedicineLabel   MedicineLabel `gorm:"references:id"`

	// PrescriptionID ทำหน้าที่เป็น FK
	PrescriptionID *uint
	Prescription   Prescription `gorm:"references:id"`

	// Dispense_statusID ทำหน้าที่เป็น FK
	DispenseStatusID *uint
	DispenseStatus   DispenseStatus `gorm:"references:id"`

	AuthoritiesID *uint
	Authorities   Authorities `gorm:"references:id"`

	Bills []Bill `gorm:"foreignKey:DispenseMedicineID"`

}
