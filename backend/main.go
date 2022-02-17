package main

import (
	"github.com/gin-gonic/gin"
	"github.com/tzcap/prescription/controller"
	"github.com/tzcap/prescription/entity"
	"github.com/tzcap/prescription/middlewares"
)

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())
	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorizes())
		{
			// Authority Routes
			protected.GET("/authorities", controller.ListAuthorities)
			protected.GET("/authority/:id", controller.GetAuthority)
			protected.POST("/authorities", controller.CreateAuthority)
			protected.PATCH("/authorities", controller.UpdateAuthority)
			protected.DELETE("/authorities/:id", controller.DeleteAuthority)

			// Medicine Room Routes
			protected.GET("/medicineRooms", controller.ListMedicineRooms)
			protected.GET("/medicineRoom/:id", controller.GetMedicineRoom)
			protected.POST("/medicineRooms", controller.CreateMedicineRoom)
			protected.PATCH("/medicineRooms", controller.UpdateMedicineRoom)
			protected.DELETE("/medicineRooms/:id", controller.DeleteMedicineRoom)

			// Payment Status Routes
			protected.GET("/paymentStatuses", controller.ListPaymentStatuses)
			protected.GET("/paymentStatus/:id", controller.GetPaymentStatus)
			protected.POST("/paymentStatuses", controller.CreatePaymentStatus)
			protected.PATCH("/paymentStatuses", controller.UpdatePaymentStatus)
			protected.DELETE("/paymentStatuses/:id", controller.DeletePaymentStatus)

			// Prescription Routes
			protected.GET("/Prescriptions", controller.ListPrescriptions)
			protected.GET("/Prescription/:id", controller.GetPrescription)
			protected.POST("/Prescriptions", controller.CreatePrescription)
			protected.PATCH("/Prescriptions", controller.UpdatePrescription)
			protected.DELETE("/Prescriptions/:id", controller.DeletePrescription)
			protected.GET("/PrescriptionSearch/:id", controller.GetPrescriptionSearch)

			// Suggestion Routes
			protected.GET("/suggestions", controller.ListSuggestion)
			protected.GET("/suggestion/:id", controller.GetSuggestion)
			protected.POST("/suggestions", controller.CreateSuggestion)
			protected.PATCH("/suggestions", controller.UpdateSuggestion)
			protected.DELETE("/suggestions/:id", controller.DeleteSuggestion)

			// Effect Routes
			protected.GET("/effects", controller.ListEffect)
			protected.GET("/effect/:id", controller.GetEffect)
			protected.POST("/effects", controller.CreateEffect)
			protected.PATCH("/effects", controller.UpdateEffect)
			protected.DELETE("/effects/:id", controller.DeleteEffect)

			//MedicineLabels Routes
			protected.GET("/medicineLabels", controller.ListMedicineLabel)
			protected.GET("/medicineLabel/:id", controller.GetMedicineLabel)
			protected.POST("/medicineLabels", controller.CreateMedicineLabel)
			protected.PATCH("/medicineLabels", controller.UpdateMedicineLabel)
			protected.DELETE("/medicineLabels/:id", controller.DeleteMedicineLabel)

			// MedicineStorage Routes
			protected.GET("/medicineStorages", controller.ListMedicineStorage)
			protected.GET("/medicineStorage/:id", controller.GetMedicineStorage)
			protected.POST("/medicineStorages", controller.CreateMedicineStorage)
			protected.PATCH("/medicineStorages", controller.UpdateMedicineStorage)
			protected.DELETE("/medicineStorages/:id", controller.DeleteMedicineStorage)

			// MedicineType Routes
			protected.GET("/medicineTypes", controller.ListMedicineType)
			protected.GET("/medicineType/:id", controller.GetMedicineType)
			protected.POST("/medicineTypes", controller.CreateMedicineType)
			protected.PATCH("/medicineTypes", controller.UpdateMedicineType)
			protected.DELETE("/medicineTypes/:id", controller.DeleteMedicineType)

			// MedicineDisbursement Routes
			protected.GET("/disbursements", controller.ListMedicine_disbursement)
			protected.GET("/disbursement/:id", controller.GetMedicine_disbursement)
			protected.POST("/disbursements", controller.CreateMedicine_disbursement)
			protected.PATCH("/disbursements", controller.UpdateMedicine_disbursement)
			protected.DELETE("/disbursements/:id", controller.DeleteMedicine_disbursement)
			protected.GET("/listMedicine", controller.GetListMedicine)
			protected.GET("/medicines/:id", controller.GetMedicineFromMedicineRoom)

			//Packing
			protected.GET("/packings", controller.ListPacking)
			protected.GET("/packing/:id", controller.GetPacking)

			//Medicinereceive
			protected.GET("/medicinereceives", controller.ListMedicinereceive)
			protected.POST("/medicinereceive", controller.CreateMedicinereceive)

			// receivetype
			protected.GET("/receives", controller.ListReceive)
			protected.GET("/receive/:id", controller.GetReceive)

			//DispenseMedicine Routes
			protected.GET("/dispenseMedicines", controller.ListDispense_Medicine)
			protected.GET("/dispenseMedicine/:id", controller.GetDispense_Medicine)
			protected.POST("/dispenseMedicines", controller.CreateDispense_Medicine)
			protected.PATCH("/dispenseMedicines", controller.UpdateDispense_Medicine)
			protected.DELETE("/dispenseMediciness/:id", controller.DeleteDispense_Medicine)
			/* protected.GET("/BillPaymentStatus", controller.ListBillNotBlank) */

			//Paymentmethod Routes
			protected.GET("/paymentmethods", controller.ListPaymentmethod)
			protected.GET("/paymentmethod/:id", controller.GetPaymentmethod)
			protected.POST("/paymentmethods", controller.CreatePaymentmethod)
			protected.PATCH("/paymentmethods", controller.UpdatePaymentmethod)
			protected.DELETE("/paymentmethods/:id", controller.DeletePaymentmethod)

			//Bill Routes
			protected.GET("/bills", controller.ListBill)
			protected.GET("/bill/:id", controller.GetBill)
			protected.POST("/bills", controller.CreateBill)
			protected.PATCH("/bills", controller.UpdateBill)
			protected.DELETE("/bills/:id", controller.DeleteBill)
			protected.GET("/PrescriptionPaymentStatusNotPaid", controller.ListPrescriptionPaymentStatusNotPaid)
			protected.GET("/PrescriptionNo/:id", controller.GetPrescriptionNo)

			// Dispense_status Routes
			protected.GET("/dispenseStatuses", controller.ListDispenseStatus)
			protected.GET("/dispenseStatus/:id", controller.GetDispenseStatus)
			protected.POST("/dispenseStatuses", controller.CreateDispenseStatus)
			protected.PATCH("/dispenseStatuses", controller.UpdateDispenseStatus)
			protected.DELETE("/dispenseStatuses/:id", controller.DeleteDispenseStatus)
		}
	}
	// Run the server
	r.POST("/login", controller.Login)
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
