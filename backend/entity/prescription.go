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
	MedicineRoomID   *uint
	MedicineRoom     MedicineRoom `gorm:"references:id"`
	Amount           uint
	Payment_statusID *uint
	Payment_status   PaymentStatus `gorm:"references:id"`
	RecordingTime    time.Time      `valid:"notpast~RecordingTime not be past"`
	Dispense_Medicines []DispenseMedicine `gorm:"foreignKey:PrescriptionID"`

}

type PaymentStatus struct {
	gorm.Model
	Status        string
	Prescriptions []Prescription `gorm:"foreignKey:Payment_statusID"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("notpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Second * -1)) //เวลา > เวลาปัจจุบัน - 1 วินาที
	})
}
