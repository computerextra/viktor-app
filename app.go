package main

import (
	"context"
	"database/sql"
	"fmt"
	"math"
	"os"
	"sort"
	"strings"
	"time"

	"viktor/db"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jlaffaye/ftp"
	"github.com/lucsky/cuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
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

func (a *App) GetMitarbeiter() []db.Mitarbeiter {
	ma, err := a.db.GetMitarbeiter(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return ma
}

func (a *App) UploadImage(id string, nr int) string {
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

	splitted := strings.Split(file.Name(), ".")
	fileType := splitted[len(splitted)-1]
	filename := fmt.Sprintf("%s-%v.%s", id, nr, fileType)
	path := fmt.Sprintf("https://bilder.computer-extra.de/data/%s", filename)

	remoteFile := a.config.FTP_UPLOAD_PATH + filename

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

	ftpClient.Delete(remoteFile)

	if err := ftpClient.Stor(remoteFile, file); err != nil {
		runtime.LogError(a.ctx, err.Error())
		return ""
	}

	return path
}

type EinkaufUpdateProps struct {
	MitarbeiterId string
	Paypal        bool
	Abonniert     bool
	Dinge         string
	Geld          *string
	Pfand         *string
	Bild1         *string
	Bild2         *string
	Bild3         *string
}

func (a *App) UpdateEinkauf(props EinkaufUpdateProps) bool {
	id, err := a.db.CheckEinkauf(a.ctx, props.MitarbeiterId)

	loc, _ := time.LoadLocation("Europe/Berlin")
	abgeschickt := time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), 0, 0, 0, 0, loc)

	var Geld, Pfand, Bild1, Bild2, Bild3 sql.NullString

	if props.Geld == nil {
		Geld.Valid = false
	} else if len(*props.Geld) > 0 {
		Geld.Valid = true
		Geld.String = *props.Geld
	}

	if props.Pfand == nil {
		Pfand.Valid = false
	} else if len(*props.Pfand) > 0 {
		Pfand.Valid = true
		Geld.String = *props.Geld
	}

	if props.Bild1 == nil {
		Bild1.Valid = false
	} else if len(*props.Bild1) > 0 {
		Bild1.Valid = true
		Bild1.String = *props.Bild1
	}

	if props.Bild2 == nil {
		Bild2.Valid = false
	} else if len(*props.Bild2) > 0 {
		Bild2.Valid = true
		Bild2.String = *props.Bild2
	}

	if props.Bild3 == nil {
		Bild3.Valid = false
	} else if len(*props.Bild3) > 0 {
		Bild3.Valid = true
		Bild3.String = *props.Bild3
	}

	if err != nil {
		id = cuid.New()
		err := a.db.CreateEinkauf(a.ctx, db.CreateEinkaufParams{
			ID:          id,
			Paypal:      props.Paypal,
			Abonniert:   props.Abonniert,
			Geld:        Geld,
			Pfand:       Pfand,
			Dinge:       props.Dinge,
			Bild1:       Bild1,
			Bild2:       Bild2,
			Bild3:       Bild3,
			Abgeschickt: abgeschickt,
		})
		if err != nil {
			runtime.LogError(a.ctx, err.Error())
			return false
		}
		err = a.db.LinkEinkauf(a.ctx, db.LinkEinkaufParams{
			Einkaufid: sql.NullString{
				String: id,
				Valid:  true,
			},
			ID: props.MitarbeiterId,
		})
		if err != nil {
			runtime.LogError(a.ctx, err.Error())
			return false
		}
	}

	err = a.db.UpdateEinkauf(a.ctx, db.UpdateEinkaufParams{
		Paypal:      props.Paypal,
		Abonniert:   props.Abonniert,
		Geld:        Geld,
		Pfand:       Pfand,
		Dinge:       props.Dinge,
		Bild1:       Bild1,
		Bild2:       Bild2,
		Bild3:       Bild3,
		ID:          id,
		Abgeschickt: abgeschickt,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}

	return true
}

func (a *App) SkipEinkauf(id string) bool {
	loc, _ := time.LoadLocation("Europe/Berlin")
	abgeschickt := time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), 0, 0, 0, 0, loc).AddDate(0, 0, 1)
	err := a.db.SkipEinkauf(a.ctx, db.SkipEinkaufParams{
		Abgeschickt: abgeschickt,
		ID:          id,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) DeleteEinkauf(id string) bool {
	loc, _ := time.LoadLocation("Europe/Berlin")
	abgeschickt := time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), 0, 0, 0, 0, loc).AddDate(0, 0, -1)
	err := a.db.DeleteEinkauf(a.ctx, db.DeleteEinkaufParams{
		Abonniert:   false,
		Abgeschickt: abgeschickt,
		ID:          id,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

type Geburtstag struct {
	Name string
	Diff float64
	Date time.Time
}

type Geburtstagsliste struct {
	Heute     []Geburtstag
	Zukunft   []Geburtstag
	Vergangen []Geburtstag
}

func (a *App) GetGeburtstagsliste() *Geburtstagsliste {
	ma, err := a.db.GetMitarbeiter(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}

	loc, _ := time.LoadLocation("Europe/Berlin")
	var Heute []Geburtstag
	var Zukunft []Geburtstag
	var Vergangen []Geburtstag

	now := time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), 0, 0, 0, 0, loc)
	Year := now.Year()
	for _, ma := range ma {
		if ma.Geburtstag.Valid {
			maGeburtstag := time.Date(Year, ma.Geburtstag.Time.Month(), ma.Geburtstag.Time.Day(), 0, 0, 0, 0, loc)
			since := math.Ceil(now.Sub(maGeburtstag).Hours() / 24)

			if since == 0 {
				Heute = append(Heute, Geburtstag{
					Name: ma.Name,
					Diff: since,
					Date: maGeburtstag,
				})
			} else if since < 0 {
				Zukunft = append(Zukunft, Geburtstag{
					Name: ma.Name,
					Diff: since,
					Date: maGeburtstag,
				})
			} else {
				Vergangen = append(Vergangen, Geburtstag{
					Name: ma.Name,
					Diff: since,
					Date: maGeburtstag,
				})
			}
		}
	}
	sort.SliceStable(Heute, func(i, j int) bool {
		return Heute[i].Diff > Heute[j].Diff
	})
	sort.SliceStable(Zukunft, func(i, j int) bool {
		return Zukunft[i].Diff > Zukunft[j].Diff
	})
	sort.SliceStable(Vergangen, func(i, j int) bool {
		return Vergangen[i].Diff < Vergangen[j].Diff
	})

	return &Geburtstagsliste{
		Heute:     Heute,
		Zukunft:   Zukunft,
		Vergangen: Vergangen,
	}
}

func (a *App) GetEinkaufsliste() []db.GetEinkaufslisteRow {
	ma, err := a.db.GetEinkaufsliste(a.ctx)
	if err != nil {
		return nil
	}
	return ma
}

func (a *App) GetEinkauf(id string) *db.GetEinkaufRow {
	ma, err := a.db.GetEinkauf(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return &ma
}
