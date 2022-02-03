package entity

import (
	"time"

	"gorm.io/gorm"
)

// type User struct {
// 	gorm.Model
// 	Name           string `valid:"required~Name cannot be blank"`
// 	Email          string `gorm:"uniqueIndex" valid:"email"`
// 	Password       string
// 	MedicineLabels []MedicineLabel `gorm:"foreignKey:RecorderID"`
// }

type MedicineLabel struct {
	gorm.Model
	Instruction string
	Property    string
	Consumption string
	Date        time.Time

	MedicineDisbursementID *uint
	MedicineDisbursement   MedicineDisbursement `gorm:"references:id"`

	SuggestionID *uint
	Suggestion   Suggestion `gorm:"references:id"`

	EffectID *uint
	Effect   Effect `gorm:"references:id"`

	AuthoritiesID *uint
	Authorities   Authorities `gorm:"references:id"`

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
