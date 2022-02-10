package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ตรวจสอบ
func TestBillPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	bill := Bill{
		BillNo:   1000,
		BillTime: time.Now().Add(24 * time.Hour),
		Payer:    "abcde",
		Total:    100,
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bill)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

// ตรวจสอบค่า BillNoไม่ต้องตามที่กำหนดแล้วต้องเจอ Error

func TestBillNoMustBeInValidPattern(t *testing.T) {
	g := NewGomegaWithT(t)

	bill := Bill{
		BillNo:   10001, //ผิด
		BillTime: time.Now().Add(24 * time.Hour),
		Payer:    "abcde",
		Total:    100,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bill)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("BillNo must be 4 digits"))

}

// ตรวจสอบวันเป็นอดีตแล้วต้องเจอ Error
func TestBillTimeMustBeFuture(t *testing.T) {
	g := NewGomegaWithT(t)

	bill := Bill{
		BillNo:   1001,
		BillTime: time.Now().Add(time.Hour * -24), //อดีต ผิด
		Payer:    "abcde",
		Total:    100,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bill)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("BillTime must be in the not past"))
}

// ตรวจสอบค่าว่างของผู้ชำระเงินแล้วต้องเจอ Error
func TestPayerCannotBeBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	bill := Bill{
		BillNo:   1001,
		BillTime: time.Now().Add(time.Hour * 24),
		Payer:    "", //เป็นค่าว่าง ผิด
		Total:    100,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bill)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Payer cannot be blank"))
}

// ตรวจสอบค่า Totalไม่เป็นค่าจำนวนเต็มบวกแล้วต้องเจอ Error
func TestTotalMustBePositive(t *testing.T) {
	g := NewGomegaWithT(t)

	bill := Bill{
		BillNo:   1001,
		BillTime: time.Now().Add(time.Hour * 24),
		Payer:    "awesome",
		Total:    0, //เป็นจำนวนเต็ม 0 ผิด
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bill)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Total must be Positive"))
}
