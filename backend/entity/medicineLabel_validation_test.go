package entity

import (
	"testing"
	//"fmt"

	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestInstructionPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	medicineLabel := MedicineLabel{

		Instruction: "ก่อนอาหาร",
		Property:    "แก้ไอ",
		Consumption: "1",
		Date:        time.Now(),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(medicineLabel)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

// ตรวจสอบค่าว่างของชื่อแล้วต้องเจอ Error
func TestInstructionNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	medicineLabel := MedicineLabel{

		Instruction: "",
		Property:    "แก้ไอ",
		Consumption: "1",
		Date:        time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(medicineLabel)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Instruction cannot be blank"))
}

// ตรวจสอบค่าว่างของชื่อแล้วต้องเจอ Error ...
func TestPropertyNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	medicineLabel := MedicineLabel{

		Instruction: "ก่อนอาหาร",
		Property:    "",
		Consumption: "1",
		Date:        time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(medicineLabel)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Property cannot be blank"))
}

func TestConsumptionBePositive(t *testing.T) {
	g := NewGomegaWithT(t)

	medicineLabel := MedicineLabel{
		Instruction: "ก่อนอาหาร",
		Property:    "แก้ไอ",
		Consumption: "-1",
		Date:        time.Now(),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(medicineLabel)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Consumption must be Positive"))

}
func TestDateNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	medicineLabel := MedicineLabel{

		Instruction: "ก่อนอาหาร",
		Property:    "แก้ไอ",
		Consumption: "1",
		Date:        time.Now().Add(time.Minute * -10), // อดีตผิด วันที่เวลาต้องไม่เป็นอดีต

	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(medicineLabel)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Date not be past"))
}
