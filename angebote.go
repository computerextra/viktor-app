package main

import (
	"database/sql"
	"time"
	"viktor/db"

	"github.com/lucsky/cuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type AngebotProps struct {
	Title     string
	Subtitle  *string
	DateStart string
	DateStop  string
	Link      string
	Image     string
	Anzeigen  bool
}

func (a *App) GetAngebot(id string) *db.Angebot {
	res, err := a.db.GetAngebot(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return &res
}

func (a *App) GetAngebote() []db.Angebot {
	res, err := a.db.GetAngebote(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return res
}

func (a *App) CreateAngebot(props AngebotProps) bool {
	var Subtitle sql.NullString
	var DateStart time.Time
	var DateStop time.Time

	if props.Subtitle != nil && len(*props.Subtitle) > 0 {
		Subtitle.Valid = true
		Subtitle.String = *props.Subtitle
	}

	DateStart, err := time.Parse("2006-01-02", props.DateStart)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	DateStop, err = time.Parse("2006-01-02", props.DateStop)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}

	_, err = a.db.CreateAngebot(a.ctx, db.CreateAngebotParams{
		ID:        cuid.New(),
		Title:     props.Title,
		Subtitle:  Subtitle,
		DateStart: DateStart,
		DateStop:  DateStop,
		Link:      props.Link,
		Image:     props.Image,
		Anzeigen:  props.Anzeigen,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) UpdateAngebot(id string, props AngebotProps) bool {
	var Subtitle sql.NullString
	var DateStart time.Time
	var DateStop time.Time

	if props.Subtitle != nil && len(*props.Subtitle) > 0 {
		Subtitle.Valid = true
		Subtitle.String = *props.Subtitle
	}

	DateStart, err := time.Parse("2006-01-02", props.DateStart)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	DateStop, err = time.Parse("2006-01-02", props.DateStop)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}

	err = a.db.UpdateAngebot(a.ctx, db.UpdateAngebotParams{
		Title:     props.Title,
		Subtitle:  Subtitle,
		DateStart: DateStart,
		DateStop:  DateStop,
		Link:      props.Link,
		Image:     props.Image,
		Anzeigen:  props.Anzeigen,
		ID:        id,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) DeleteAngebot(id string) bool {
	err := a.db.DeleteAngebot(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) ToggleAngebot(id string) bool {
	res, err := a.db.GetAngebot(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	err = a.db.ToggleAngebot(a.ctx, db.ToggleAngebotParams{
		Anzeigen: !res.Anzeigen,
		ID:       id,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}
