package main

import (
	"context"
	"database/sql"
	"fmt"

	"viktor/db"

	wailsconfigstore "github.com/AndreiTelteu/wails-configstore"
	_ "github.com/go-sql-driver/mysql"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx    context.Context
	db     *db.Queries
	config *Config
	auth   *wailsconfigstore.ConfigStore
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	config := NewConfig()

	a.ctx = ctx
	a.config = config

	database, err := sql.Open("mysql", config.DATABASE_URL)
	if err != nil {
		a.showErrorDialog("Fehler", "Es kann keine Datenbankverbindung hergestellt werden.")
		panic(err)
	}
	queries := db.New(database)

	configStore, err := wailsconfigstore.NewConfigStore("Viktor")
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Es kann keine Config gefunden werden.\n%s", err.Error()))
		panic(err)
	}
	err = configStore.Set("server.json", wailsconfigstore.Config(""))
	if err != nil {
		a.showErrorDialog("FEHLER", err.Error())
	}
	a.auth = configStore
	a.db = queries

	// a.CheckVersion()
}

func (a *App) showErrorDialog(title, message string) {
	runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:          runtime.ErrorDialog,
		DefaultButton: "OK",
		Title:         title,
		Message:       message,
	})
}
