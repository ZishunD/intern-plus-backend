package graph

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func NewDB() *sql.DB {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_DATABASE")

	fmt.Println("DB connection info:", user, pass, host, port, name)

	dsn := user + ":" + pass + "@tcp(" + host + ":" + port + ")/" + name + "?parseTime=true&charset=utf8mb4"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("DB connection error:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("DB ping error:", err)
	}

	return db
}
