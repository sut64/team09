package entity

import (
	"testing"
	"time"

	// "fmt"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestDispenseMedicinePass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	dispensemedicine := DispenseMedicine{
		DispensemedicineNo: 100001,
		ReceiveName:        "Somsri",
		DispenseTime:       time.Now(),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(dispensemedicine)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

func TestReceiveNameNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	dispensemedicine := DispenseMedicine{
		DispensemedicineNo: 100001,
		ReceiveName:        "",
		DispenseTime:       time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(dispensemedicine)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("ReceiveName cannot be blank"))
}

func TestDispensemedicineNoMustBeInTheRange(t *testing.T) {
	g := NewGomegaWithT(t)

	dispensemedicine := DispenseMedicine{
		DispensemedicineNo: 1000001, // ผิด ต้องเป็นเลข 6 หลัก
		ReceiveName:        "Somsri",
		DispenseTime:       time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(dispensemedicine)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("DispensemedicineNo must be 6 digits"))
}

func TestDispenseTimeNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	dispensemedicine := DispenseMedicine{
		DispensemedicineNo: 100001,
		ReceiveName:        "Somsri",
		DispenseTime:       time.Now().Add(time.Minute * -10), // อดีตผิด วันที่เวลาต้องไม่เป็นอดีต
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(dispensemedicine)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("DispenseTime not be past"))
}
