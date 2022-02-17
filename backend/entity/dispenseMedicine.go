package entity

import (
	"time"

	"github.com/asaskevich/govalidator"

	"gorm.io/gorm"
)

type DispenseStatus struct {
	gorm.Model
	Status string

	DispenseMedicines []DispenseMedicine `gorm:"foreignKey:DispenseStatusID"`
}

type DispenseMedicine struct {
	gorm.Model
	DispensemedicineNo uint      `gorm:"uniqueIndex" valid:"range(100000|999999)~DispensemedicineNo must be 6 digits, required~DispensemedicineNo must be 6 digits"`
	ReceiveName        string    `valid:"required~ReceiveName cannot be blank"`
	DispenseTime       time.Time `valid:"donotpast~DispenseTime not be past"`

	// Bill ทำหน้าที่เป็น FK
	BillID *uint
	Bill   Bill `gorm:"references:id" valid:"-"`

	// Dispense_statusID ทำหน้าที่เป็น FK
	DispenseStatusID *uint
	DispenseStatus   DispenseStatus `gorm:"references:id" valid:"-"`

	AuthoritiesID *uint
	Authorities   Authorities `gorm:"references:id" valid:"-"`
}

// ตรวจสอบเวลาไม่เป็นอดีต (ไม่เป็นอดีตเกิน 1 นาที)
func init() {
	govalidator.CustomTypeTagMap.Set("donotpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -1)) //เวลา > เวลาปัจจุบัน - 1 นาที
	})
}
