package entity

import (
	// "time"
	"gorm.io/gorm"
)

type Authorities struct {
	gorm.Model
	AuthorityID            string
	FirstName              string
	LastName               string
	Email                  string
	Password               string
	TelNo                  string
	Prescriptions          []Prescription         `gorm:"foreignKey:AuthoritiesID"`
	MedicineLabels         []MedicineLabel        `gorm:"foreignKey:AuthoritiesID"`
	Medicine_disbursements []MedicineDisbursement `gorm:"foreignKey:AuthoritiesID"`
	Medicinereceives       []Medicinereceive      `gorm:"foreignKey:AuthoritiesID"`
	Bills                  []Bill                 `gorm:"foreignKey:AuthoritiesID"`
	DispenseMedicines     []DispenseMedicine    `gorm:"foreignKey:AuthoritiesID"`
}
