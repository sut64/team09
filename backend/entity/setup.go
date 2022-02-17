package entity

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("sa-64.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	database.AutoMigrate(&Authorities{}, &PaymentStatus{}, &Prescription{},
		&MedicineLabel{}, &Suggestion{}, &Effect{},
		&MedicineRoom{}, &MedicineStorage{}, &MedicineType{}, &MedicineDisbursement{},
		&Packing{}, &ReceiveType{}, &Medicinereceive{},
		&DispenseMedicine{}, &Paymentmethod{}, &Bill{},
		&DispenseStatus{}, &DispenseMedicine{},
	)

	db = database

	// Authority Data
	password1, err := bcrypt.GenerateFromPassword([]byte("86164091"), 14)
	db.Model(&Authorities{}).Create(&Authorities{
		AuthorityID: "A0001",
		FirstName:   "Chayodom",
		LastName:    "Heha",
		Email:       "chayodom@gmail.com",
		Password:    string(password1),
		TelNo:       "0911112233",
	})

	password2, err := bcrypt.GenerateFromPassword([]byte("123456"), 14)
	db.Model(&Authorities{}).Create(&Authorities{
		AuthorityID: "A0002",
		FirstName:   "Demo",
		LastName:    "Account",
		Email:       "demo@gmail.com",
		Password:    string(password2),
		TelNo:       "0911112233",
	})

	password, err := bcrypt.GenerateFromPassword([]byte("123456"), 14)
	db.Model(&Authorities{}).Create(&Authorities{
		AuthorityID: "A0003",
		FirstName:   "Yotsaphon",
		LastName:    "Jantanam",
		Email:       "b6218294@gmail.com",
		Password:    string(password),
		TelNo:       "0828753990",
	})

	password3, err := bcrypt.GenerateFromPassword([]byte("123456"), 14)
	db.Model(&Authorities{}).Create(&Authorities{
		AuthorityID: "A0004",
		FirstName:   "Chanon",
		LastName:    "Kongsanthia",
		Email:       "b6226770@gmail.com",
		Password:    string(password3),
		TelNo:       "0966655555",
	})

	var bee Authorities
	var chanon Authorities

	db.Raw("SELECT * FROM authorities WHERE email = ?", "b6218294@gmail.com").Scan(&bee)
	db.Raw("SELECT * FROM authorities WHERE email = ?", "b6226770@gmail.com").Scan(&chanon)

	//Payment Status
	status1 := PaymentStatus{
		Status: "Not Paid",
	}
	db.Model(&PaymentStatus{}).Create(&status1)

	status2 := PaymentStatus{
		Status: "Paid",
	}
	db.Model(&PaymentStatus{}).Create(&status2)

	//Suggestion
	sug1 := Suggestion{
		SuggestionName: "ใช้ยาจนหมด",
	}
	db.Model(&Suggestion{}).Create(&sug1)

	sug2 := Suggestion{
		SuggestionName: "หยุดใช้เมื่อหาย",
	}
	db.Model(&Suggestion{}).Create(&sug2)

	//Effect
	effect1 := Effect{
		EffectName: "ทานแล้วอาจทำให้ง่วงซึม",
	}
	db.Model(&Effect{}).Create(&effect1)

	effect2 := Effect{
		EffectName: "ทำให้รู้สึกขมคอ",
	}
	db.Model(&Effect{}).Create(&effect2)

	effect3 := Effect{
		EffectName: "ทานแล้วอาจทำให้อาเจียน",
	}
	db.Model(&Effect{}).Create(&effect3)

	effect4 := Effect{
		EffectName: "ทานแล้วอาจทำให้คลื่นไส้",
	}
	db.Model(&Effect{}).Create(&effect4)

	//Medicinetype data
	Medicinetype1 := MedicineType{
		Name: "CAP",
	}
	db.Model(&MedicineType{}).Create(&Medicinetype1)
	Medicinetype2 := MedicineType{
		Name: "TAB",
	}
	db.Model(&MedicineType{}).Create(&Medicinetype2)
	Medicinetype3 := MedicineType{
		Name: "SYRUP",
	}
	db.Model(&MedicineType{}).Create(&Medicinetype3)

	//Medicinestorage data
	Medicinestorage1 := MedicineStorage{
		Name:         "ASPIRIN",
		Count:        2000,
		Sell:         400,
		MedicineType: Medicinetype2,
	}
	db.Model(&MedicineStorage{}).Create(&Medicinestorage1)

	Medicinestorage2 := MedicineStorage{
		Name:         "GEMFIBROZIL",
		Count:        2800,
		Sell:         980,
		MedicineType: Medicinetype1,
	}
	db.Model(&MedicineStorage{}).Create(&Medicinestorage2)

	Medicinestorage3 := MedicineStorage{
		Name:         "ATENOLOL",
		Count:        800,
		Sell:         680,
		MedicineType: Medicinetype2,
	}
	db.Model(&MedicineStorage{}).Create(&Medicinestorage3)

	Medicinestorage4 := MedicineStorage{
		Name:         "ENALAPRIL",
		Count:        600,
		Sell:         520,
		MedicineType: Medicinetype2,
	}
	db.Model(&MedicineStorage{}).Create(&Medicinestorage4)

	Medicinestorage5 := MedicineStorage{
		Name:         "LACTULOSE",
		Count:        1000,
		Sell:         1080,
		MedicineType: Medicinetype3,
	}
	db.Model(&MedicineStorage{}).Create(&Medicinestorage5)

	Medicinestorage6 := MedicineStorage{
		Name:         "NIFEDIPINE",
		Count:        300,
		Sell:         180,
		MedicineType: Medicinetype2,
	}
	db.Model(&MedicineStorage{}).Create(&Medicinestorage6)

	//Medicineroom data
	Medicineroom1 := MedicineRoom{
		Name: "ห้องยาผู้ป่วยใน(IPD)",
	}
	db.Model(&MedicineRoom{}).Create(&Medicineroom1)

	Medicineroom2 := MedicineRoom{
		Name: "ห้องยาผู้ป่วยนอก(OPD)",
	}
	db.Model(&MedicineRoom{}).Create(&Medicineroom2)

	//Packing data
	Packing1 := Packing{
		Name: "กล่อง",
	}
	db.Model(&Packing{}).Create(&Packing1)

	Packing2 := Packing{
		Name: "ขวด",
	}
	db.Model(&Packing{}).Create(&Packing2)

	Packing3 := Packing{
		Name: "เม็ด",
	}
	db.Model(&Packing{}).Create(&Packing3)

	Receive1 := ReceiveType{
		Name: "โรงพยาบาล",
	}
	db.Model(&ReceiveType{}).Create(&Receive1)

	Receive2 := ReceiveType{
		Name: "บริษัท",
	}
	db.Model(&ReceiveType{}).Create(&Receive2)

	//Paymentmethod รูปแบบการชำระเงิน
	cash := Paymentmethod{
		ConditionsOfPayments: "ชำระด้วยเงินสด",
	}
	db.Model(&Paymentmethod{}).Create(&cash)

	payment := Paymentmethod{
		ConditionsOfPayments: "โอนพร้อมเพย์",
	}
	db.Model(&Paymentmethod{}).Create(&payment)

	// Dispense_status Data
	dispense_status01 := DispenseStatus{
		Status: "จ่ายแล้ว",
	}
	db.Model(&DispenseStatus{}).Create(&dispense_status01)

	dispense_status02 := DispenseStatus{
		Status: "ยังไม่ได้จ่าย",
	}
	db.Model(&DispenseStatus{}).Create(&dispense_status02)

	var medicine MedicineStorage
	db.Raw("SELECT * FROM medicine_storages WHERE name = ?", "ASPIRIN").Scan(&medicine)

	var medicine1 MedicineStorage
	db.Raw("SELECT * FROM medicine_storages WHERE name = ?", "GEMFIBROZIL").Scan(&medicine1)

	disbursement1 := MedicineDisbursement{
		DisbursementID:  "D1000",
		DisbursementDAY: time.Now(),
		AmountMedicine:  50,
		Authorities:     chanon,
		MedicineStorage: medicine,
		MedicineRoom:    Medicineroom1,
	}
	db.Model(&MedicineDisbursement{}).Create(&disbursement1)

	disbursement2 := MedicineDisbursement{
		DisbursementID:  "D1001",
		DisbursementDAY: time.Now(),
		AmountMedicine:  50,
		Authorities:     chanon,
		MedicineStorage: medicine,
		MedicineRoom:    Medicineroom2,
	}
	db.Model(&MedicineDisbursement{}).Create(&disbursement2)

	disbursement3 := MedicineDisbursement{
		DisbursementID:  "D1002",
		DisbursementDAY: time.Now(),
		AmountMedicine:  100,
		Authorities:     chanon,
		MedicineStorage: medicine1,
		MedicineRoom:    Medicineroom2,
	}
	db.Model(&MedicineDisbursement{}).Create(&disbursement3)

	disbursement4 := MedicineDisbursement{
		DisbursementID:  "D1003",
		DisbursementDAY: time.Now(),
		AmountMedicine:  300,
		Authorities:     chanon,
		MedicineStorage: medicine1,
		MedicineRoom:    Medicineroom2,
	}
	db.Model(&MedicineDisbursement{}).Create(&disbursement4)

	var disbursement MedicineDisbursement
	db.Raw("SELECT * FROM medicine_disbursements WHERE id = 1").Scan(&disbursement)

	// ใบสั่งยาที่ชำระเงินค่ายาแล้ว
	Prescription101010 := Prescription{
		PrescriptionNo:       101010,
		PatientName:          "Hunki",
		MedicineDisbursement: disbursement3,
		Authorities:          chanon,
		Amount:               6,
		PaymentStatus:        status2,
		RecordingTime:        time.Date(2022, 2, 15, 1, 30, 0, 0, time.UTC),
	}
	db.Model(&Prescription{}).Create(&Prescription101010)

	// ใบสั่งยาที่จำนวนยาเป็น 0 ใบชำระเงินค่ายาเกิด error Total เมื่อบันทึก
	Prescription00 := Prescription{
		PrescriptionNo:       100000,
		PatientName:          "Sometimes",
		MedicineDisbursement: disbursement4,
		Authorities:          chanon,
		Amount:               0,
		PaymentStatus:        status1,
		RecordingTime:        time.Now(),
	}
	db.Model(&Prescription{}).Create(&Prescription00)

	Prescription01 := Prescription{
		PrescriptionNo:       100001,
		PatientName:          "nakhon",
		MedicineDisbursement: disbursement,
		Authorities:          chanon,
		Amount:               4,
		PaymentStatus:        status1,
		RecordingTime:        time.Now(),
	}
	db.Model(&Prescription{}).Create(&Prescription01)

	// --- MedicineLabel Data
	medicinelabel01 := MedicineLabel{
		MedicineDisbursement: disbursement1,
		Suggestion:           sug1,
		Effect:               effect1,
		Instruction:          "ก่อนอาหาร",
		Property:             "แก้ไอ",
		Consumption:          "1",
		Authorities:          chanon,
		Date:                 time.Now(),
	}
	db.Model(&MedicineLabel{}).Create(&medicinelabel01)

	// Bill ใบชำระเงินค่ายา
	bill1 := Bill{
		BillNo:   1000,
		BillTime: time.Date(2022, 2, 15, 2, 0, 0, 0, time.UTC),
		Payer:    "AWESOME08",
		Total:    6 * 980,

		Authorities:   bee,
		Prescription:  Prescription101010,
		Paymentmethod: cash,
	}
	db.Model(&Bill{}).Create(&bill1)

	dispense_medicine01 := DispenseMedicine{
		Bill:               bill1,
		DispensemedicineNo: 100000,
		ReceiveName:        "Somchai",
		DispenseTime:       time.Now(),
		DispenseStatus:     dispense_status01,
		Authorities:        chanon,
	}
	db.Model(&DispenseMedicine{}).Create(&dispense_medicine01)

}
