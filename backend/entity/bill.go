package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Bill struct {
	gorm.Model

	BillNo   uint      `gorm:"uniqueIndex" valid:"range(1000|9999)~BillNo must be 4 digits"`
	BillTime time.Time `valid:"future~BillTime must be in the future"`
	Payer    string    `valid:"required~Payer cannot be blank"`
	Total    uint      `valid:"required~Total must be Positive"`

	PaymentmethodID *uint
	Paymentmethod   Paymentmethod `gorm:"references:id" valid:"-"`

	AuthoritiesID *uint
	Authorities   Authorities `gorm:"references:id" valid:"-"`

	PrescriptionID *uint
	Prescription   Prescription `gorm:"references:id" valid:"-"`
}

type Paymentmethod struct {
	gorm.Model
	ConditionsOfPayments string

	Bills []Bill `gorm:"foreignKey:PaymentmethodID"`
}

// ตรวจสอบเวลาไม่เป็นอดีต
func init() {
	govalidator.CustomTypeTagMap.Set("future", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now())
	})
}
