package entity

import (
	"github.com/asaskevich/govalidator"
	"time"

	"gorm.io/gorm"
)

type Prescription struct {
	gorm.Model
	PatientName      string `valid:"required~Name cannot be blank"`
	PrescriptionNo   uint   `gorm:"uniqueIndex" valid:"range(100000|999999)~PrescriptionNo must be 6 digits"`
	AuthoritiesID    *uint
	Authorities      Authorities `gorm:"references:id"`
	MedicineDisbursementID   *uint
	MedicineDisbursement     MedicineDisbursement `gorm:"references:id"`
	Amount           uint
	Payment_statusID *uint
	Payment_status   PaymentStatus `gorm:"references:id"`
	RecordingTime    time.Time      `valid:"notpast~RecordingTime not be past"`
	Dispense_Medicines []DispenseMedicine `gorm:"foreignKey:PrescriptionID"`

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
