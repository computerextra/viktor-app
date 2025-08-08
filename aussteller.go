package main

import (
	"database/sql"
	"fmt"
	"os"
	"strings"
	"time"
	"viktor/db"

	"github.com/jlaffaye/ftp"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type AusstellerProps struct {
	Artikelnummer string
	Link          string
}

func (a *App) SyncAussteller() bool {
	sage_artikel, err := a.getAusstellerArtikel()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}

	// Raw dogging query
	rawQuery := "INSERT INTO Aussteller (id, Artikelnummer, Artikelname, Specs, Preis) VALUES"

	for idx, item := range sage_artikel {
		if idx == len(sage_artikel)-1 {
			rawQuery = fmt.Sprintf("%s (%d, '%s', '%s', '%s', %.2f)", rawQuery, item.Id, item.Artikelnummer, strings.ReplaceAll(item.Artikelname, "'", "\""), strings.ReplaceAll(item.Specs, "'", "\""), item.Preis)
		} else {
			rawQuery = fmt.Sprintf("%s (%d, '%s', '%s', '%s', %.2f),", rawQuery, item.Id, item.Artikelnummer, strings.ReplaceAll(item.Artikelname, "'", "\""), strings.ReplaceAll(item.Specs, "'", "\""), item.Preis)
		}
	}

	rawQuery = fmt.Sprintf("%s ON DUPLICATE KEY UPDATE Artikelnummer = VALUES(Artikelnummer), Artikelname = VALUES(Artikelname), Specs = VALUES(Specs), Preis = VALUES(Preis);", rawQuery)

	conn, err := sql.Open("mysql", a.config.DATABASE_URL)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	defer conn.Close()

	_, err = conn.Exec(rawQuery)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) UpdateAussteller(props AusstellerProps) bool {
	err := a.db.UpdateAusteller(a.ctx, db.UpdateAustellerParams{
		Bild: sql.NullString{
			String: props.Link,
			Valid:  true,
		},
		Artikelnummer: props.Artikelnummer,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) UploadAusstellerImage() string {
	DialogFile, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return ""
	}
	file, err := os.Open(DialogFile)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return ""
	}
	defer file.Close()

	ftpClient, err := ftp.Dial(fmt.Sprintf("%s:%v", a.config.FTP_SERVER, a.config.FTP_PORT), ftp.DialWithTimeout(5*time.Second))
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return ""
	}
	defer ftpClient.Quit()

	if err := ftpClient.Login(a.config.FTP_USER, a.config.FTP_PASS); err != nil {
		runtime.LogError(a.ctx, err.Error())
		return ""
	}
	path := fmt.Sprintf("https://bilder.computer-extra.de/data/%s", file.Name())

	remoteFile := a.config.FTP_UPLOAD_PATH + file.Name()

	ftpClient.Delete(remoteFile)

	if err := ftpClient.Stor(remoteFile, file); err != nil {
		runtime.LogError(a.ctx, err.Error())
		return ""
	}

	return path
}
