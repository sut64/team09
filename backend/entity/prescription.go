package entity

import (
	"time"

	"github.com/asaskevich/govalidator"

	"gorm.io/gorm"
)

type Prescription struct {
	gorm.Model
	PatientName            string `valid:"required~Name cannot be blank"`
	PrescriptionNo         uint   `gorm:"uniqueIndex" valid:"range(100000|999999)~PrescriptionNo must be 6 digits"`
	AuthoritiesID          *uint
	Authorities            Authorities `gorm:"references:id" valid:"-"`
	MedicineDisbursementID *uint
	MedicineDisbursement   MedicineDisbursement `gorm:"references:id" valid:"-"`
	Amount                 uint
	PaymentStatusID        *uint
	PaymentStatus          PaymentStatus `gorm:"references:id" valid:"-"`
	RecordingTime          time.Time     `valid:"notpast~RecordingTime not be past"`
	Bills                  []Bill        `gorm:"foreignKey:PrescriptionID"`
}

type PaymentStatus struct {
	gorm.Model
	Status        string
	Prescriptions []Prescription `gorm:"foreignKey:PaymentStatusID"`
}

// ตรวจสอบเวลาไม่เป็นอดีต (ไม่เป็นอดีตเกิน 1 นาที)
func init() {
	govalidator.CustomTypeTagMap.Set("notpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -1)) //เวลา > เวลาปัจจุบัน - 1 นาที
	})
}
