package main

import (
	"database/sql"
	"fmt"
	"viktor/db"

	"github.com/lucsky/cuid"
)

type AnsprechpartnerProps struct {
	Name          string
	Telefon       *string
	Mobil         *string
	Mail          *string
	LieferantenId string
}

func (a *App) GetAnsprechpartnerFromLieferant(lieferantenId string) []db.Ansprechpartner {
	res, err := a.db.GetAnsprechpartnerFromLieferant(a.ctx, lieferantenId)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return nil
	}
	return res
}

func (a *App) GetAnsprechpartner(id string) *db.Ansprechpartner {
	res, err := a.db.GetAnsprechpartner(a.ctx, id)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return nil
	}
	return &res
}

func (a *App) CreateAnsprechpartner(props AnsprechpartnerProps) bool {
	var Telefon, Mobil, Mail sql.NullString

	if props.Mail != nil && len(*props.Mail) > 0 {
		Mail.String = *props.Mail
		Mail.Valid = true
	}
	if props.Mobil != nil && len(*props.Mobil) > 0 {
		Mobil.String = *props.Mobil
		Mobil.Valid = true
	}
	if props.Telefon != nil && len(*props.Telefon) > 0 {
		Telefon.String = *props.Telefon
		Telefon.Valid = true
	}

	_, err := a.db.CreateAnsprechpartner(a.ctx, db.CreateAnsprechpartnerParams{
		ID:          cuid.New(),
		Name:        props.Name,
		Telefon:     Telefon,
		Mobil:       Mobil,
		Mail:        Mail,
		Lieferantid: props.LieferantenId,
	})
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}
	return true
}

func (a *App) UpdateAnsprechpartner(id string, props AnsprechpartnerProps) bool {
	var Telefon, Mobil, Mail sql.NullString

	if props.Mail != nil && len(*props.Mail) > 0 {
		Mail.String = *props.Mail
		Mail.Valid = true
	}
	if props.Mobil != nil && len(*props.Mobil) > 0 {
		Mobil.String = *props.Mobil
		Mobil.Valid = true
	}
	if props.Telefon != nil && len(*props.Telefon) > 0 {
		Telefon.String = *props.Telefon
		Telefon.Valid = true
	}

	err := a.db.UpdateAnsprechpartner(a.ctx, db.UpdateAnsprechpartnerParams{
		Name:    props.Name,
		Telefon: Telefon,
		Mobil:   Mobil,
		Mail:    Mail,
		ID:      id,
	})
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}
	return true
}

func (a *App) DeleteAnsprechpartner(id string) bool {
	err := a.db.DeleteAnsprechpartner(a.ctx, id)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}
	return true
}
