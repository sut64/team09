package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Bill struct {
	gorm.Model

	BillNo   string    `valid:"matches(^[A]\\{4}$)"`
	BillTime time.Time `valid:"future~BillTime must be in the future"`
	Payer    string
	Total    uint

	PaymentmethodID *uint
	Paymentmethod   Paymentmethod

	PriceID *uint
	Price   Price

	AuthoritiesID *uint
	Authorities   Authorities

	DispenseMedicineID *uint
	DispenseMedicine   DispenseMedicine
}
type Price struct {
	gorm.Model
	Value uint

	Bills []Bill `gorm:"foreignKey:PriceID"`
}
type Paymentmethod struct {
	gorm.Model
	ConditionsOfPayments string

	Bills []Bill `gorm:"foreignKey:PaymentmethodID"`
}


func init() {
	govalidator.CustomTypeTagMap.Set("past", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.Before(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("future", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now())
	})
}
