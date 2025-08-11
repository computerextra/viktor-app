package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// TODO: Check for Updates
	//
	// err := doUpdate("https://bilder.computer-extra.de/data/viktor")
	// if err != nil {
	// 	panic(err)
	// }

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Viktor",
		Width:  1600,
		Height: 900,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []any{
			app,
		},
	})
	if err != nil {
		println("Error:", err.Error())
	}
}

// TODO: Richtig einlesen und alles neu machen
// func doUpdate(url string) error {
// 	resp, err := http.Get(url)
// 	if err != nil {
// 		return err
// 	}
// 	defer resp.Body.Close()
// 	err = selfupdate.Apply(resp.Body, selfupdate.Options{})
// 	if err != nil {
// 		panic(err)
// 	}
// 	return err
// }
