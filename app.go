package main

import (
	"context"
	"database/sql"
	"fmt"
	"math"
	"sort"
	"time"

	"viktor/db"

	_ "github.com/go-sql-driver/mysql"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
	db  *db.Queries
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	// TODO: env file with mysql connection string
	database, err := sql.Open("mysql", "")
	if err != nil {
		panic(err)
	}
	queries := db.New(database)

	a.ctx = ctx
	a.db = queries
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
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

func (a *App) GetMitarbeiter() *Geburtstagsliste {
	ma, err := a.db.GetGeburtstagsliste(a.ctx)
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
