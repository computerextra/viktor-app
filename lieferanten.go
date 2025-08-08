package main

import (
	"database/sql"
	"viktor/db"

	"github.com/lucsky/cuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type LieferantenResponse struct {
	Lieferant       db.Lieferant
	Ansprechpartner []db.Ansprechpartner
}

func (a *App) GetLieferanten() []LieferantenResponse {
	var response []LieferantenResponse

	res, err := a.db.GetLieferanten(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}

	for _, lieferant := range res {
		aps, err := a.db.GetAnsprechpartnerFromLieferant(a.ctx, lieferant.ID)
		if err != nil {
			runtime.LogError(a.ctx, err.Error())
			return nil
		}
		response = append(response, LieferantenResponse{
			Lieferant:       lieferant,
			Ansprechpartner: aps,
		})
	}
	return response
}

func (a *App) GetLieferant(id string) *LieferantenResponse {
	res, err := a.db.GetLieferant(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	aps, err := a.db.GetAnsprechpartnerFromLieferant(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return &LieferantenResponse{
		Lieferant:       res,
		Ansprechpartner: aps,
	}
}

type LieferantenProps struct {
	Firma        string
	Kundennummer *string
	Webseite     *string
}

func (a *App) CreateLieferant(props LieferantenProps) bool {
	var Kundennummer sql.NullString
	var Webseite sql.NullString

	if props.Kundennummer != nil && len(*props.Kundennummer) > 0 {
		Kundennummer.String = *props.Kundennummer
		Kundennummer.Valid = true
	}
	if props.Webseite != nil && len(*props.Webseite) > 0 {
		Webseite.String = *props.Webseite
		Webseite.Valid = true
	}

	_, err := a.db.CreateLieferant(a.ctx, db.CreateLieferantParams{
		ID:           cuid.New(),
		Firma:        props.Firma,
		Kundennummer: Kundennummer,
		Webseite:     Webseite,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) UpdateLieferant(id string, props LieferantenProps) bool {
	var Kundennummer sql.NullString
	var Webseite sql.NullString

	if props.Kundennummer != nil && len(*props.Kundennummer) > 0 {
		Kundennummer.String = *props.Kundennummer
		Kundennummer.Valid = true
	}
	if props.Webseite != nil && len(*props.Webseite) > 0 {
		Webseite.String = *props.Webseite
		Webseite.Valid = true
	}
	err := a.db.UpdateLieferant(a.ctx, db.UpdateLieferantParams{
		Firma:        props.Firma,
		Kundennummer: Kundennummer,
		Webseite:     Webseite,
		ID:           id,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) DeleteLieferant(id string) bool {
	err := a.db.DeleteLieferant(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}
