package main

import (
	"context"
	"database/sql"

	"viktor/db"

	_ "github.com/go-sql-driver/mysql"
)

// App struct
type App struct {
	ctx    context.Context
	db     *db.Queries
	config *Config
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	config := NewConfig()

	database, err := sql.Open("mysql", config.DATABASE_URL)
	if err != nil {
		panic(err)
	}
	queries := db.New(database)

	a.ctx = ctx
	a.db = queries
	a.config = config
}
