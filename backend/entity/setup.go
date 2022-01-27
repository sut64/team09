package entity

import (
	// "golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {

	return db
}
func SetupDatabase() {

	database, err := gorm.Open(sqlite.Open("../database/se-64.db"), &gorm.Config{})

	if err != nil {

		panic("failed to connect database")

	}
	database.AutoMigrate(&Authority{},
		&Medicinereceive{},
		&Medicinestorage{},
		&Packing{},
		&ReceiveType{},
		&Medicinetype{})

	db = database

	// var packings = []Packing{{Name: "เม็ด"}, {Name: "แผง"}, {Name: "ขวด"}, {Name: "กล่อง"}}
	// db.Create(&packings)

	// var receives = []Receive{{Name: "โรงบาล"}, {Name: "บริษัท"}}
	// db.Create(&receives)

	// db.Model(&Medicinestorage{}).Create([]map[string]interface{}{
	// 	{"Name": "พารา", "Count": 0, "MedicinetypeID": 1},
	// 	{"Name": "ไฟเซอร์", "Count": 0, "MedicinetypeID": 2},
	// })

	// var medicinetype = []Medicinetype{{Name: "t1"}, {Name: "t2"}}
	// db.Create(&medicinetype)
}
