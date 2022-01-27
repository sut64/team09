package main

import (
	"fmt"

	"github.com/Hitmepls/project/controller"
	"github.com/Hitmepls/project/entity"
	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Print("Hello world")
	protected := gin.Default()
	protected.Use(CORSMiddleware())
	entity.SetupDatabase()
	//Packing
	protected.GET("/packings", controller.ListPacking)
	protected.GET("/packing/:id", controller.GetPacking)
	//receive
	// protected.GET("/receives", controller.ListReceive)
	// protected.GET("/receive/:id", controller.GetReceive)

	//medicine
	protected.GET("/medicinestorages", controller.ListMedicinestorage)
	protected.GET("/medicinestorage/:id", controller.GetMedicinestorage)

	//medicintype
	protected.GET("/medicintypes", controller.ListMedicinetype)
	protected.GET("/medicintype/:id", controller.GetMedicinetype)

	//Medicinereceive
	protected.POST("/medicinereceive", controller.CreateMedicinereceive)

	protected.Run()
}
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
