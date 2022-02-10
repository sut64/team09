package entity

import (
	"time"

	"gorm.io/gorm"
)

type MedicineLabel struct {
	gorm.Model
	Instruction string    `valid:"required~Instruction cannot be blank"`
	Property    string    `valid:"required~Property cannot be blank"`
	Consumption string    `valid:"range(0|100)~Consumption must be Positive"`
	Date        time.Time `valid:"notpast~Date not be past"`

	MedicineDisbursementID *uint
	MedicineDisbursement   MedicineDisbursement `gorm:"references:id" valid:"-"`

	SuggestionID *uint
	Suggestion   Suggestion `gorm:"references:id" valid:"-"`

	EffectID *uint
	Effect   Effect `gorm:"references:id" valid:"-"`

	AuthoritiesID *uint
	Authorities   Authorities `gorm:"references:id" valid:"-"`
}

type Suggestion struct {
	gorm.Model
	SuggestionName string          `gorm:"uniqueIndex"`
	MedicineLabels []MedicineLabel `gorm:"foreignKey:SuggestionID"`
}
type Effect struct {
	gorm.Model
	EffectName     string          `gorm:"uniqueIndex"`
	MedicineLabels []MedicineLabel `gorm:"foreignKey:EffectID"`
}
