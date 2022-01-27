package controller
 
import (
	"github.com/tzcap/prescription/entity"
	"github.com/gin-gonic/gin"
	"net/http"
)

// POST /authorities
func CreateAuthority(c *gin.Context) {
	var authority entity.Authorities
	if err := c.ShouldBindJSON(&authority); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	if err := entity.DB().Create(&authority).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": authority})
}

// GET /authority/:id
func GetAuthority(c *gin.Context) {
	var authority entity.Authorities
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM authorities WHERE id = ?", id).Scan(&authority).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": authority})
}

// GET /authorities
func ListAuthorities(c *gin.Context) {
	var authorities []entity.Authorities
	if err := entity.DB().Raw("SELECT * FROM authorities").Scan(&authorities).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": authorities})
}

// DELETE /authorities/:id
func DeleteAuthority(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM authorities WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "authority not found"})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /authorities
func UpdateAuthority(c *gin.Context) {
	var authorities entity.Authorities
	if err := c.ShouldBindJSON(&authorities); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	if tx := entity.DB().Where("id = ?", authorities.ID).First(&authorities); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "authority not found"})
		return
	}
 
	if err := entity.DB().Save(&authorities).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"data": authorities})
}
