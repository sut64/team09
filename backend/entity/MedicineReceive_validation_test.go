package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestMedicinereceiveReceiveddateNotPast(t *testing.T) {
	g := NewGomegaWithT(t)
	input := "2020-08-31"
	layout := "2006-01-02"
	receiveddate, _ := time.Parse(layout, input)
	med := Medicinereceive{
		Receiveddate:  receiveddate,
		Expire:        time.Now(),
		Company:       "โรงพยาบาลเซนเมรี่",
		Count:         2,
		Price_of_unit: 100.00,
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(med)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Receiveddate must be not past"))

}
func TestMedicinereceiveExpriceNotPast(t *testing.T) {
	g := NewGomegaWithT(t)
	input := "2020-08-31"
	layout := "2006-01-02"
	expire, _ := time.Parse(layout, input)
	med := Medicinereceive{
		Receiveddate:  time.Now(),
		Expire:        expire,
		Company:       "โรงพยาบาลเซนเมรี่",
		Count:         2,
		Price_of_unit: 100.00,
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(med)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Expire must be not past"))

}
func TestMedicinereceivePriceBePositive(t *testing.T) {
	g := NewGomegaWithT(t)
	nums := []float64{
		0, -100.00,
	}
	for _, num := range nums {
		med := Medicinereceive{
			Receiveddate:  time.Now(),
			Expire:        time.Now(),
			Company:       "โรงพยาบาลเซนเมรี่",
			Count:         100,
			Price_of_unit: num,
		}
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(med)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("Price must be Positive"))
	}
}

func TestMedicinereceiveCountBePositive(t *testing.T) {
	g := NewGomegaWithT(t)

	med := Medicinereceive{
		Receiveddate:  time.Now(),
		Expire:        time.Now(),
		Company:       "โรงพยาบาลเซนเมรี่",
		Count:         0,
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

func TestMedicinereceiveCompanyNotNull(t *testing.T) {
	g := NewGomegaWithT(t)

	med := Medicinereceive{
		Receiveddate:  time.Now(),
		Expire:        time.Now(),
		Company:       "",
		Count:         100,
		Price_of_unit: 100.00,
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(med)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Company fill not null"))
}

func TestMedicinereceivePass(t *testing.T) {
	g := NewGomegaWithT(t)

	med := Medicinereceive{
		Receiveddate:  time.Now(),
		Expire:        time.Now(),
		Company:       "โรงพยาบาลเซนเมรี่",
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
