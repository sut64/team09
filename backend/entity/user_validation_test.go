package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestMedicinereceiveCountBePositive(t *testing.T) {
	g := NewGomegaWithT(t)

	med := Medicinereceive{
		Receiveddate:  time.Now(),
		Expire:        time.Now(),
		Company:       "ss",
		Count:         -1,
		Price_of_unit: 100.00,
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(med)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Count must be Positive"))
}

func TestMedicinereceivePass(t *testing.T) {
	g := NewGomegaWithT(t)

	med := Medicinereceive{
		Receiveddate:  time.Now(),
		Expire:        time.Now(),
		Company:       "ss",
		Count:         2,
		Price_of_unit: 100.00,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(med)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())

}
