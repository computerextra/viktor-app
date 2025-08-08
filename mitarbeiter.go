package main

import (
	"database/sql"
	"math"
	"sort"
	"time"
	"viktor/db"

	"github.com/lucsky/cuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

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

func (a *App) GetMitarbeiter() []db.Mitarbeiter {
	ma, err := a.db.GetMitarbeiter(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return ma
}

func (a *App) GetOneMitarbeiter(id string) *db.Mitarbeiter {
	ma, err := a.db.GetOneMitarbeiter(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return &ma
}

func (a *App) GetMitarbeiterMitAbteilung() []db.GetMitarbeiterWithAbteilungRow {
	ma, err := a.db.GetMitarbeiterWithAbteilung(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return ma
}

func (a *App) GetOneMitarbeiterMitAbteilung(id string) *db.GetOneMitarbeiterWithAbteilungRow {
	ma, err := a.db.GetOneMitarbeiterWithAbteilung(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return &ma
}

type MitarbeiterProps struct {
	Name           string
	Image          bool
	Azubi          bool
	Short          *string
	Sex            *string
	Focus          *string
	Mail           *string
	AbteilungId    *string
	Geburtstag     *string
	Gruppenwahl    *string
	Homeoffice     *string
	MobilBusiness  *string
	MobilPrivat    *string
	TelefonIntern1 *string
	TelefonIntern2 *string
	TelefonPrivat  *string
}

func (a *App) CreateMitarbeiter(props MitarbeiterProps) bool {
	var Short,
		Sex,
		Focus,
		Mail,
		AbteilungId,
		Gruppenwahl,
		Homeoffice,
		MobilBusiness,
		MobilPrivat,
		TelefonIntern1,
		TelefonIntern2,
		TelefonPrivat sql.NullString
	var Geburtstag sql.NullTime

	if props.Geburtstag != nil && len(*props.Geburtstag) > 0 {
		d, err := time.Parse("2006-01-02", *props.Geburtstag)
		if err != nil {
			runtime.LogError(a.ctx, err.Error())
			return false
		}
		Geburtstag.Time = d
		Geburtstag.Valid = true
	}

	if props.Short != nil && len(*props.Short) > 0 {
		Short.String = *props.Short
		Short.Valid = true
	}
	if props.Sex != nil && len(*props.Sex) > 0 {
		Sex.String = *props.Sex
		Sex.Valid = true
	}
	if props.Focus != nil && len(*props.Focus) > 0 {
		Focus.String = *props.Focus
		Focus.Valid = true
	}
	if props.Mail != nil && len(*props.Mail) > 0 {
		Mail.String = *props.Mail
		Mail.Valid = true
	}
	if props.AbteilungId != nil && len(*props.AbteilungId) > 0 {
		AbteilungId.String = *props.AbteilungId
		AbteilungId.Valid = true
	}
	if props.Gruppenwahl != nil && len(*props.Gruppenwahl) > 0 {
		Gruppenwahl.String = *props.Gruppenwahl
		Gruppenwahl.Valid = true
	}
	if props.Homeoffice != nil && len(*props.Homeoffice) > 0 {
		Homeoffice.String = *props.Homeoffice
		Homeoffice.Valid = true
	}
	if props.MobilBusiness != nil && len(*props.MobilBusiness) > 0 {
		MobilBusiness.String = *props.MobilBusiness
		MobilBusiness.Valid = true
	}
	if props.MobilPrivat != nil && len(*props.MobilPrivat) > 0 {
		MobilPrivat.String = *props.MobilPrivat
		MobilPrivat.Valid = true
	}
	if props.TelefonIntern1 != nil && len(*props.TelefonIntern1) > 0 {
		TelefonIntern1.String = *props.TelefonIntern1
		TelefonIntern1.Valid = true
	}
	if props.TelefonIntern2 != nil && len(*props.TelefonIntern2) > 0 {
		TelefonIntern2.String = *props.TelefonIntern2
		TelefonIntern2.Valid = true
	}
	if props.TelefonPrivat != nil && len(*props.TelefonPrivat) > 0 {
		TelefonPrivat.String = *props.TelefonPrivat
		TelefonPrivat.Valid = true
	}

	_, err := a.db.CreateMitarbeiter(a.ctx, db.CreateMitarbeiterParams{
		ID:             cuid.New(),
		Name:           props.Name,
		Short:          Short,
		Image:          props.Image,
		Sex:            Sex,
		Focus:          Focus,
		Mail:           Mail,
		Abteilungid:    AbteilungId,
		Azubi:          props.Azubi,
		Geburtstag:     Geburtstag,
		Gruppenwahl:    Gruppenwahl,
		Homeoffice:     Homeoffice,
		MobilBusiness:  MobilBusiness,
		MobilPrivat:    MobilPrivat,
		TelefonIntern1: TelefonIntern1,
		TelefonIntern2: TelefonIntern2,
		TelefonPrivat:  TelefonPrivat,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) UpdateMitarbeiter(id string, props MitarbeiterProps) bool {
	var Short,
		Sex,
		Focus,
		Mail,
		AbteilungId,
		Gruppenwahl,
		Homeoffice,
		MobilBusiness,
		MobilPrivat,
		TelefonIntern1,
		TelefonIntern2,
		TelefonPrivat sql.NullString
	var Geburtstag sql.NullTime

	if props.Geburtstag != nil && len(*props.Geburtstag) > 0 {
		d, err := time.Parse("2006-01-02", *props.Geburtstag)
		if err != nil {
			runtime.LogError(a.ctx, err.Error())
			return false
		}
		Geburtstag.Time = d
		Geburtstag.Valid = true
	}

	if props.Short != nil && len(*props.Short) > 0 {
		Short.String = *props.Short
		Short.Valid = true
	}
	if props.Sex != nil && len(*props.Sex) > 0 {
		Sex.String = *props.Sex
		Sex.Valid = true
	}
	if props.Focus != nil && len(*props.Focus) > 0 {
		Focus.String = *props.Focus
		Focus.Valid = true
	}
	if props.Mail != nil && len(*props.Mail) > 0 {
		Mail.String = *props.Mail
		Mail.Valid = true
	}
	if props.AbteilungId != nil && len(*props.AbteilungId) > 0 {
		AbteilungId.String = *props.AbteilungId
		AbteilungId.Valid = true
	}
	if props.Gruppenwahl != nil && len(*props.Gruppenwahl) > 0 {
		Gruppenwahl.String = *props.Gruppenwahl
		Gruppenwahl.Valid = true
	}
	if props.Homeoffice != nil && len(*props.Homeoffice) > 0 {
		Homeoffice.String = *props.Homeoffice
		Homeoffice.Valid = true
	}
	if props.MobilBusiness != nil && len(*props.MobilBusiness) > 0 {
		MobilBusiness.String = *props.MobilBusiness
		MobilBusiness.Valid = true
	}
	if props.MobilPrivat != nil && len(*props.MobilPrivat) > 0 {
		MobilPrivat.String = *props.MobilPrivat
		MobilPrivat.Valid = true
	}
	if props.TelefonIntern1 != nil && len(*props.TelefonIntern1) > 0 {
		TelefonIntern1.String = *props.TelefonIntern1
		TelefonIntern1.Valid = true
	}
	if props.TelefonIntern2 != nil && len(*props.TelefonIntern2) > 0 {
		TelefonIntern2.String = *props.TelefonIntern2
		TelefonIntern2.Valid = true
	}
	if props.TelefonPrivat != nil && len(*props.TelefonPrivat) > 0 {
		TelefonPrivat.String = *props.TelefonPrivat
		TelefonPrivat.Valid = true
	}

	err := a.db.UpdateMitarbeiter(a.ctx, db.UpdateMitarbeiterParams{
		Name:           props.Name,
		Short:          Short,
		Image:          props.Image,
		Sex:            Sex,
		Focus:          Focus,
		Mail:           Mail,
		Abteilungid:    AbteilungId,
		Azubi:          props.Azubi,
		Geburtstag:     Geburtstag,
		Gruppenwahl:    Gruppenwahl,
		Homeoffice:     Homeoffice,
		MobilBusiness:  MobilBusiness,
		MobilPrivat:    MobilPrivat,
		TelefonIntern1: TelefonIntern1,
		TelefonIntern2: TelefonIntern2,
		TelefonPrivat:  TelefonPrivat,
		ID:             id,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) DeleteMitabeiter(id string) bool {
	err := a.db.DeleteMitarbeiter(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}
