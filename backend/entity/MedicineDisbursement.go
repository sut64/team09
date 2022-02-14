package entity

import (
	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
	"time"
)

type MedicineRoom struct {
	gorm.Model
	Name                  string `gorm:"uniqueIndex"`
	MedicineDisbursements []MedicineDisbursement `gorm:"foreignKey:MedicineRoomID"`

}
type MedicineDisbursement struct {
	gorm.Model
	DisbursementID    string `gorm:"uniqueIndex" valid:"matches(^[D]\\d{4}$)"`	
	DisbursementDAY   time.Time	`valid:"Notpast~DisbursementDAY must be in the past"`
	AmountMedicine    uint	`valid:"required~AmountMedicine must to be greater 0,Positivenumber~AmountMedicine must to be greater 0"`
	AuthoritiesID     *uint
	Authorities       Authorities `gorm:"references:id" valid:"-"`
	MedicineStorageID *uint
	MedicineStorage   MedicineStorage `gorm:"references:id" valid:"-"`
	MedicineRoomID	  *uint
	MedicineRoom      MedicineRoom `gorm:"references:id" valid:"-"`
	Prescriptions     []Prescription  `gorm:"foreignKey:MedicineDisbursementID"`
	MedicineLabels    []MedicineLabel `gorm:"foreignKey:MedicineDisbursementID"`
}

func init(){
	govalidator.CustomTypeTagMap.Set("Notpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -1))
	})

	govalidator.CustomTypeTagMap.Set("Positivenumber", func(i interface{}, context interface{}) bool {
		t := i.(uint)
		if t <= 0 {
			return false
		} else {
			return true
		}

	})
	
}


