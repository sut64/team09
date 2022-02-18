package entity

import (
	"testing"
	"time"
	"fmt"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestDisbursementPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	disbursement := MedicineDisbursement{
		DisbursementID: "D0000",
		DisbursementDAY: time.Now(),
		AmountMedicine: 100,
		
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(disbursement)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

func TestDisbursementIDMustBeInValidPattern(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []string{
		"x0000",
		"Dx000",  // D ตามด้วย X และ \d 3 ตัว
		"D000",   // D ตามด้วย \d 3 ตัว
		"D00000", // D ตามด้วย \d 5 ตัว
	}

	for _, fixture := range fixtures {
		disbursement := MedicineDisbursement{
			DisbursementID: fixture,// ผิด
			DisbursementDAY: time.Now(),
			AmountMedicine: 100,
		}

		ok, err := govalidator.ValidateStruct(disbursement)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal(fmt.Sprintf(`DisbursementID: %s does not validate as matches(^[D]\d{4}$)`, fixture)))
	}
}

func TestDisbursementDAYMustNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	disbursement := MedicineDisbursement{
		DisbursementID: "D0000",
		DisbursementDAY: time.Now().Add(time.Minute * -20), //ผิด
		AmountMedicine: 100,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(disbursement)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("DisbursementDAY must be in the past"))
}

func TestAmountMedicneMustBeGreater0(t *testing.T){
	g := NewGomegaWithT(t)

	disbursement := MedicineDisbursement{
		DisbursementID: "D0000",
		DisbursementDAY: time.Now(),
		AmountMedicine: 0, //ผิด
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(disbursement)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("AmountMedicine must to be greater 0"))

}





