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
	DispensemedicineNo uint
	ReceiveName        string
	DispenseTime       time.Time //`valid:"present~DispenseTime must be in the present"`

	// Bill ทำหน้าที่เป็น FK
	BillID *uint
	Bill   Bill `gorm:"references:id"`

	// Dispense_statusID ทำหน้าที่เป็น FK
	DispenseStatusID *uint
	DispenseStatus   DispenseStatus `gorm:"references:id"`

	AuthoritiesID *uint
	Authorities   Authorities `gorm:"references:id"`
}
