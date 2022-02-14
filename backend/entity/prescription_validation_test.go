package entity

import (
	"testing"
	"time"
	// "fmt"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestPrescriptionPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	prescription := Prescription{
		PatientName:    "Chayodom Heha",
		PrescriptionNo: 100001,
		Amount:         10,
		RecordingTime:  time.Now(),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(prescription)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

func TestPatientNameNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	prescription := Prescription{
		PatientName:    "",
		PrescriptionNo: 100001,
		Amount:         10,
		RecordingTime:  time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(prescription)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Name cannot be blank"))
}

func TestPrescriptionNOMustBeInTheRange(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []uint{
		10000000, // ต้องเป็นเลข 6 ตัว
		1000011,  // ต้องเป็นเลข 6 ตัว
		10000,    // ต้องเป็นเลข 6 ตัว
		1000,     // ต้องเป็นเลข 6 ตัว
	}

	for _, fixture := range fixtures {
		prescription := Prescription{
			PatientName:    "Chayodom Heha",
			PrescriptionNo: fixture, // ผิด
			Amount:         10,
			RecordingTime:  time.Now(),
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(prescription)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("PrescriptionNo must be 6 digits"))
	}
}

func TestRecordingTimeNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	prescription := Prescription{
		PatientName:    "Chayodom Heha",
		PrescriptionNo: 100001,
		Amount:         10,
		RecordingTime:  time.Now().Add(time.Minute * -10), // อดีตผิด วันที่เวลาต้องไม่เป็นอดีต

	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(prescription)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("RecordingTime not be past"))
}

func TestAmountMustBePositiveNumber(t *testing.T) {
	g := NewGomegaWithT(t)

	prescription := Prescription{
		PatientName:    "Chayodom Heha",
		PrescriptionNo: 100001,
		Amount:         0, // ผิด จำนวนยาต้องเป็นจำนวนบวก
		RecordingTime:  time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(prescription)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Amount Must Be Positive Number"))
}
