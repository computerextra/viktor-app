package main

import (
	"fmt"
	"viktor/db"

	"github.com/lucsky/cuid"
)

type AbteilungProps struct {
	Name string
}

func (a *App) GetAbteilungen() []db.Abteilung {
	res, err := a.db.GetAbteilungen(a.ctx)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return nil
	}
	return res
}

func (a *App) GetAbteilung(id string) *db.Abteilung {
	res, err := a.db.GetAbteilung(a.ctx, id)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return nil
	}
	return &res
}

func (a *App) CreateAbteilung(props AbteilungProps) bool {
	_, err := a.db.CreateAbteilung(a.ctx, db.CreateAbteilungParams{
		ID:   cuid.New(),
		Name: props.Name,
	})
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}
	return true
}

func (a *App) UpdateAbteilung(id string, props AbteilungProps) bool {
	err := a.db.UpdateAbteilung(a.ctx, db.UpdateAbteilungParams{
		Name: props.Name,
		ID:   id,
	})
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}
	return true
}

func (a *App) DeleteAbteilung(id string) bool {
	err := a.db.DeleteAbteilung(a.ctx, id)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}
	return true
}
