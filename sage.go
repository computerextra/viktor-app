package main

import (
	"database/sql"
	"fmt"
	"regexp"
	"slices"
	"sort"
	"time"

	_ "github.com/denisenkom/go-mssqldb"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type AusstellerArtikel struct {
	Id            int
	Artikelnummer string
	Artikelname   string
	Specs         string
	Preis         float64
}

type FormularKunde struct {
	Kundennummer string
	Name         string
	Vorname      string
}

type SearchProps struct {
	Search string
}

type Sg_Adressen struct {
	SG_Adressen_PK int
	Suchbegriff    sql.NullString
	KundNr         sql.NullString
	LiefNr         sql.NullString
	Homepage       sql.NullString
	Telefon1       sql.NullString
	Telefon2       sql.NullString
	Mobiltelefon1  sql.NullString
	Mobiltelefon2  sql.NullString
	EMail1         sql.NullString
	EMail2         sql.NullString
	KundUmsatz     sql.NullFloat64
	LiefUmsatz     sql.NullFloat64
}

type KundenResponse struct {
	SG_Adressen_PK int
	Suchbegriff    *string
	KundNr         *string
	LiefNr         *string
	Homepage       *string
	Telefon1       *string
	Telefon2       *string
	Mobiltelefon1  *string
	Mobiltelefon2  *string
	EMail1         *string
	EMail2         *string
	KundUmsatz     *float64
	LiefUmsatz     *float64
}

type Artikel struct {
	Id            int
	Artikelnummer string
	Suchbegriff   string
	Preis         float64
}

func (a *App) getAusstellerArtikel() ([]AusstellerArtikel, error) {
	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	query := "select sg_auf_artikel.SG_AUF_ARTIKEL_PK, sg_auf_artikel.ARTNR, sg_auf_artikel.SUCHBEGRIFF, sg_auf_artikel.ZUSTEXT1, sg_auf_vkpreis.PR01 FROM sg_auf_artikel INNER JOIN sg_auf_vkpreis ON sg_auf_artikel.SG_AUF_ARTIKEL_PK = sg_auf_vkpreis.SG_AUF_ARTIKEL_FK"

	rows, err := conn.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var Sage []AusstellerArtikel

	for rows.Next() {
		var Id sql.NullInt64
		var Artikelnummer sql.NullString
		var Artikelname sql.NullString
		var Specs sql.NullString
		var Preis sql.NullFloat64
		if err := rows.Scan(&Id, &Artikelnummer, &Artikelname, &Specs, &Preis); err != nil {
			return nil, err
		}
		if Id.Valid && Artikelnummer.Valid && Artikelname.Valid && Specs.Valid && Preis.Valid {
			var tmp AusstellerArtikel
			tmp.Id = int(Id.Int64)
			tmp.Artikelnummer = Artikelnummer.String
			tmp.Artikelname = Artikelname.String
			tmp.Preis = Preis.Float64
			tmp.Specs = Specs.String
			Sage = append(Sage, tmp)
		}
	}

	return Sage, nil
}

func (a *App) getAllProducts() ([]Artikel, error) {
	var artikel []Artikel

	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	rows, err := conn.Query("SELECT sg_auf_artikel.SG_AUF_ARTIKEL_PK, sg_auf_artikel.ARTNR, sg_auf_artikel.SUCHBEGRIFF, sg_auf_vkpreis.PR01 FROM sg_auf_artikel INNER JOIN sg_auf_vkpreis ON (sg_auf_artikel.SG_AUF_ARTIKEL_PK = sg_auf_vkpreis.SG_AUF_ARTIKEL_FK)")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var art Artikel
		var Artikelnummer sql.NullString
		var Suchbegriff sql.NullString
		var Price sql.NullFloat64
		if err := rows.Scan(&art.Id, &Artikelnummer, &Suchbegriff, &Price); err != nil {
			return nil,
				err
		}
		if Artikelnummer.Valid {
			art.Artikelnummer = Artikelnummer.String
		}
		if Suchbegriff.Valid {
			art.Suchbegriff = Suchbegriff.String
		}
		if Price.Valid {
			art.Preis = Price.Float64
		}
		if Suchbegriff.Valid && Artikelnummer.Valid {
			artikel = append(artikel, art)
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return artikel, nil
}

func (a *App) KundenFormularSuche(Kundennummer string) *FormularKunde {
	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	defer conn.Close()

	rows, err := conn.Query(fmt.Sprintf("SELECT Name, Vorname FROM sg_adressen WHERE KundNr LIKE '%s';", Kundennummer))
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	defer rows.Close()

	var res FormularKunde

	for rows.Next() {
		var name sql.NullString
		var vorname sql.NullString
		if err := rows.Scan(&name, &vorname); err != nil {
			runtime.LogError(a.ctx, err.Error())
			return nil
		}
		if name.Valid {
			res.Name = name.String
		}
		if vorname.Valid {
			res.Vorname = vorname.String
		}
		if err := rows.Err(); err != nil {
			runtime.LogError(a.ctx, err.Error())
			return nil
		}
	}
	res.Kundennummer = Kundennummer
	return &res
}

func (a *App) KundenSuche(props SearchProps) []KundenResponse {
	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	defer conn.Close()

	var results []KundenResponse

	reverse, err := regexp.MatchString("^(\\d|[+]49|[0-9]+)", props.Search)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}

	var query string

	if reverse {
		query = fmt.Sprintf(`
		SELECT SG_Adressen_PK, Suchbegriff,  KundNr, LiefNr, Homepage, Telefon1, Telefon2, Mobiltelefon1, Mobiltelefon2, EMail1, EMail2, KundUmsatz, LiefUmsatz 
			FROM sg_adressen WHERE 
			REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Telefon1, ' ',''),'/',''),'-',''),'+49','0'),'(',''),')',''),',','')
			LIKE '%%%s%%' 
			OR 
			REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Telefon2, ' ',''),'/',''),'-',''),'+49','0'),'(',''),')',''),',','')
			LIKE '%%%s%%' 
			OR 
			REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Mobiltelefon1, ' ',''),'/',''),'-',''),'+49','0'),'(',''),')',''),',','')
			LIKE '%%%s%%' 
			OR 
			REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Mobiltelefon2, ' ',''),'/',''),'-',''),'+49','0'),'(',''),')',''),',','')
			LIKE '%%%s%%'`, props.Search, props.Search, props.Search, props.Search,
		)
	} else {
		query = fmt.Sprintf(`
		DECLARE @SearchWord NVARCHAR(30) 
		SET @SearchWord = N'%%%s%%' 
		SELECT 
		SG_Adressen_PK, 
		Suchbegriff,  
		KundNr, 
		LiefNr, 
		Homepage, 
		Telefon1, 
		Telefon2, 
		Mobiltelefon1, 
		Mobiltelefon2, 
		EMail1, 
		EMail2, 
		KundUmsatz, 
		LiefUmsatz 
		FROM sg_adressen 
		WHERE Suchbegriff LIKE @SearchWord 
		OR KundNr LIKE @SearchWord 
		OR LiefNr LIKE @SearchWord;`, props.Search)
	}

	rows, err := conn.Query(query)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var x Sg_Adressen
		if err := rows.Scan(
			&x.SG_Adressen_PK,
			&x.Suchbegriff,
			&x.KundNr,
			&x.LiefNr,
			&x.Homepage,
			&x.Telefon1,
			&x.Telefon2,
			&x.Mobiltelefon1,
			&x.Mobiltelefon2,
			&x.EMail1,
			&x.EMail2,
			&x.KundUmsatz,
			&x.LiefUmsatz,
		); err != nil {
			runtime.LogError(a.ctx, err.Error())
			return nil
		}
		results = append(results, KundenResponse{
			SG_Adressen_PK: x.SG_Adressen_PK,
			Suchbegriff:    &x.Suchbegriff.String,
			KundNr:         &x.KundNr.String,
			LiefNr:         &x.LiefNr.String,
			Homepage:       &x.Homepage.String,
			Telefon1:       &x.Telefon1.String,
			Telefon2:       &x.Telefon2.String,
			Mobiltelefon1:  &x.Mobiltelefon1.String,
			Mobiltelefon2:  &x.Mobiltelefon2.String,
			EMail1:         &x.EMail1.String,
			EMail2:         &x.EMail2.String,
			KundUmsatz:     &x.KundUmsatz.Float64,
			LiefUmsatz:     &x.LiefUmsatz.Float64,
		})
	}

	return results
}

func (a *App) SucheSeriennummer(Artikelnummer string) *string {
	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	defer conn.Close()

	query := fmt.Sprintf("SELECT SUCHBEGRIFF FROM sg_auf_artikel WHERE ARTNR LIKE '%s'", Artikelnummer)

	rows, err := conn.Query(query)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	defer rows.Close()

	var result string

	for rows.Next() {
		if err := rows.Scan(&result); err != nil {
			runtime.LogError(a.ctx, err.Error())
			return nil
		}
	}
	return &result
}

type History struct {
	Id     int
	Action string
}

func (a *App) getLagerHistory() ([]History, error) {
	var history []History

	queryString := fmt.Sprintf("SELECT SG_AUF_ARTIKEL_FK, Hist_Action FROM sg_auf_lager_history WHERE BEWEGUNG >= 0 AND BEMERKUNG LIKE 'Warenlieferung:%%' AND convert(varchar, Hist_Datetime, 105) = convert(varchar, getdate(), 105)")

	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	rows, err := conn.Query(queryString)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var hist History
		var Action sql.NullString

		if err := rows.Scan(&hist.Id, &Action); err != nil {
			return nil, err
		}
		if Action.Valid {
			hist.Action = Action.String
			history = append(history, hist)
		}
	}

	return history, nil
}

type Price struct {
	Id     int
	Action string
	Price  float64
}

func (a *App) getPrices() ([]Price, error) {
	var Prices []Price

	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	rows, err := conn.Query("SELECT Hist_Action, SG_AUF_ARTIKEL_FK, PR01 FROM sg_auf_vkpreis_history WHERE convert(varchar, Hist_Datetime, 105) = convert(varchar, getdate(), 105)")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var price Price
		var Action sql.NullString
		var p sql.NullFloat64

		if err := rows.Scan(&Action, &price.Id, &p); err != nil {
			return nil, fmt.Errorf("GetPrices: Row Error: %s", err)
		}
		if p.Valid {
			price.Price = p.Float64
		}
		if Action.Valid {
			price.Action = Action.String
		}
		if p.Valid && Action.Valid {
			Prices = append(Prices, price)
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return Prices, nil
}

func (a *App) getLagerWert() (float64, float64, error) {
	var wertBestand float64 = 0
	var wertVerfügbar float64 = 0

	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		return 0, 0, err
	}
	defer conn.Close()

	rows, err := conn.Query("SELECT BESTAND, VERFUEGBAR, EKPR01 FROM sg_auf_artikel WHERE BESTAND > 0")
	if err != nil {
		return 0, 0, err
	}
	defer rows.Close()

	for rows.Next() {
		var Bestand sql.NullInt16
		var Verfügbar sql.NullInt16
		var Ek sql.NullFloat64

		if err := rows.Scan(&Bestand, &Verfügbar, &Ek); err != nil {
			return 0, 0,
				err
		}
		if Bestand.Valid && Ek.Valid {
			wertBestand = wertBestand + (float64(Bestand.Int16) * Ek.Float64)
		}
		if Verfügbar.Valid && Ek.Valid {
			wertVerfügbar = wertVerfügbar + (float64(Verfügbar.Int16) * Ek.Float64)
		}
	}
	if err := rows.Err(); err != nil {
		return 0, 0, err
	}

	return wertBestand, wertVerfügbar, nil
}

type SummenArtikel struct {
	Artikelnummer string
	Artikelname   string
	Bestand       int16
	EK            float64
	Summe         float64
}

func (a *App) getHighestSum() ([]SummenArtikel, error) {
	var artikel []SummenArtikel

	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		return nil, err
	}
	defer conn.Close()
	rows, err := conn.Query("SELECT TOP 10 ARTNR, SUCHBEGRIFF, BESTAND, EKPR01, BESTAND * EKPR01 as Summe FROM sg_auf_artikel WHERE BESTAND > 0 ORDER BY Summe DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var art SummenArtikel
		var Artikelnummer sql.NullString
		var Artikelname sql.NullString
		var Bestand sql.NullInt16
		var EK sql.NullFloat64
		var Summe sql.NullFloat64

		if err := rows.Scan(&Artikelnummer, &Artikelname, &Bestand, &EK, &Summe); err != nil {
			return nil,
				err
		}
		if Artikelnummer.Valid {
			art.Artikelnummer = Artikelnummer.String
		}
		if Artikelname.Valid {
			art.Artikelname = Artikelname.String
		}
		if Bestand.Valid {
			art.Bestand = Bestand.Int16
		}
		if EK.Valid {
			art.EK = EK.Float64
		}
		if Summe.Valid {
			art.Summe = Summe.Float64
		}

		if Artikelnummer.Valid && Artikelname.Valid && Bestand.Valid && EK.Valid && Summe.Valid {
			artikel = append(artikel, art)
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return artikel, nil
}

type VerfArtikel struct {
	SummenArtikel
	Verfügbar int16
}

func (a *App) getHighestVerfSum() ([]VerfArtikel, error) {
	var artikel []VerfArtikel
	database, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		return nil, err
	}
	defer database.Close()
	rows, err := database.Query("SELECT TOP 10 ARTNR, SUCHBEGRIFF, BESTAND, VERFUEGBAR, EKPR01, VERFUEGBAR * EKPR01 as Summe FROM sg_auf_artikel WHERE VERFUEGBAR > 0 ORDER BY Summe DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var art VerfArtikel
		var Artikelnummer sql.NullString
		var Artikelname sql.NullString
		var Bestand sql.NullInt16
		var Verfügbar sql.NullInt16
		var EK sql.NullFloat64
		var Summe sql.NullFloat64

		if err := rows.Scan(&Artikelnummer, &Artikelname, &Bestand, &Verfügbar, &EK, &Summe); err != nil {
			return nil,
				err
		}
		if Artikelnummer.Valid {
			art.Artikelnummer = Artikelnummer.String
		}
		if Artikelname.Valid {
			art.Artikelname = Artikelname.String
		}
		if Bestand.Valid {
			art.Bestand = Bestand.Int16
		}
		if EK.Valid {
			art.EK = EK.Float64
		}
		if Summe.Valid {
			art.Summe = Summe.Float64
		}
		if Verfügbar.Valid {
			art.Verfügbar = Verfügbar.Int16
		}

		if Artikelnummer.Valid && Artikelname.Valid && Bestand.Valid && EK.Valid && Summe.Valid && Verfügbar.Valid {
			artikel = append(artikel, art)
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return artikel, nil
}

type Leichen struct {
	Artikelnummer string
	Artikelname   string
	Bestand       int16
	Verfügbar     int16
	EK            float64
	LetzterUmsatz string
}

func (a *App) getLeichen() ([]Leichen, error) {
	var artikel []Leichen

	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		return nil, err
	}

	defer conn.Close()
	rows, err := conn.Query("SELECT TOP 20 ARTNR, SUCHBEGRIFF, BESTAND, VERFUEGBAR, LetzterUmsatz, EKPR01 FROM sg_auf_artikel WHERE VERFUEGBAR > 0 ORDER BY LetzterUmsatz ASC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var art Leichen
		var Artikelnummer sql.NullString
		var Artikelname sql.NullString
		var Bestand sql.NullInt16
		var Verfügbar sql.NullInt16
		var EK sql.NullFloat64
		var LetzerUmsatz sql.NullString

		if err := rows.Scan(&Artikelnummer, &Artikelname, &Bestand, &Verfügbar, &LetzerUmsatz, &EK); err != nil {
			return nil,
				err
		}
		if Artikelnummer.Valid {
			art.Artikelnummer = Artikelnummer.String
		}
		if Artikelname.Valid {
			art.Artikelname = Artikelname.String
		}
		if Bestand.Valid {
			art.Bestand = Bestand.Int16
		}
		if EK.Valid {
			art.EK = EK.Float64
		}
		if Verfügbar.Valid {
			art.Verfügbar = Verfügbar.Int16
		}
		if LetzerUmsatz.Valid {
			art.LetzterUmsatz = LetzerUmsatz.String
		}

		if Artikelnummer.Valid && Artikelname.Valid && Bestand.Valid && EK.Valid && LetzerUmsatz.Valid && Verfügbar.Valid {
			artikel = append(artikel, art)
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return artikel, nil
}

type AlteSeriennummer struct {
	ArtNr       string
	Suchbegriff string
	Bestand     int
	Verfügbar   int
	GeBeginn    string
}

func (a *App) getAlteSeriennummern() ([]AlteSeriennummer, error) {
	var artikel []AlteSeriennummer

	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		return nil, err
	}
	defer conn.Close()
	rows, err := conn.Query("SELECT sg_auf_artikel.ARTNR, sg_auf_artikel.SUCHBEGRIFF, sg_auf_artikel.BESTAND, sg_auf_artikel.VERFUEGBAR, sg_auf_snr.GE_Beginn FROM sg_auf_artikel INNER JOIN sg_auf_snr ON sg_auf_artikel.SG_AUF_ARTIKEL_PK = sg_auf_snr.SG_AUF_ARTIKEL_FK  WHERE sg_auf_artikel.VERFUEGBAR > 0 AND sg_auf_snr.SNR_STATUS != 2 AND sg_auf_snr.GE_Beginn <= DATEADD(month, DATEDIFF(month, 0, DATEADD(MONTH,-1,GETDATE())), 0) ORDER BY sg_auf_snr.GE_Beginn ")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var art AlteSeriennummer
		var Artikelnummer sql.NullString
		var Suchbegriff sql.NullString
		var Bestand sql.NullInt16
		var Verfügbar sql.NullInt16
		var Garantie sql.NullString

		if err := rows.Scan(&Artikelnummer, &Suchbegriff, &Bestand, &Verfügbar, &Garantie); err != nil {
			return nil,
				err
		}

		if Artikelnummer.Valid && Suchbegriff.Valid && Bestand.Valid && Verfügbar.Valid && Garantie.Valid {
			art.ArtNr = Artikelnummer.String
			art.Suchbegriff = Suchbegriff.String
			art.Bestand = int(Bestand.Int16)
			art.Verfügbar = int(Verfügbar.Int16)
			art.GeBeginn = Garantie.String
			if !slices.Contains(artikel, art) {
				artikel = append(artikel, art)
			}
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return artikel, nil
}

type Response struct {
	Auftrag    string
	Wert       float64
	Verbrecher string
	Datum      time.Time
	Kunde      string
}

type sg_auf_fschrift struct {
	ERFART    sql.NullString
	USERNAME  sql.NullString
	DATUM     sql.NullTime
	AUFNR     sql.NullString
	ALTAUFNR  sql.NullString
	ENDPRB    sql.NullFloat64
	VERTRETER sql.NullString
	NAME      sql.NullString
}

func (a *App) getOldAuftraege() ([]Response, float64, error) {
	var verbrecher []Response
	var gesamtWert float64 = 0
	conn, err := sql.Open("sqlserver", a.config.SAGE_URL)
	if err != nil {
		return nil, 0, err
	}
	defer conn.Close()
	rows, err := conn.Query("SELECT ERFART, USERNAME, DATUM, AUFNR, ALTAUFNR, ENDPRB, VERTRETER, NAME FROM sg_auf_fschrift WHERE FORTGEFUEHRT != 1 AND (ERFART like '02AU' OR ERFART like '03LI');")
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()
	var res []sg_auf_fschrift
	for rows.Next() {
		var x sg_auf_fschrift
		if err := rows.Scan(&x.ERFART, &x.USERNAME, &x.DATUM, &x.AUFNR, &x.ALTAUFNR, &x.ENDPRB, &x.VERTRETER, &x.NAME); err != nil {
			return nil, 0, err
		}
		res = append(res, x)
	}

	for _, x := range res {
		if x.AUFNR.Valid {
			query := fmt.Sprintf("SELECT ERFART FROM sg_auf_fschrift WHERE ALTAUFNR LIKE '%s';", x.AUFNR.String)
			row, err := conn.Query(query)
			if err != nil {
				return nil, 0, err
			}
			defer row.Close()
			if row.Next() {
				var y sql.NullString
				if err := row.Scan(&y); err != nil {
					return nil, 0, err
				}
				if y.Valid {
					if y.String != "04RE" {
						if x.ENDPRB.Valid {
							verbrecher = append(verbrecher, Response{
								Auftrag:    x.AUFNR.String,
								Wert:       x.ENDPRB.Float64,
								Verbrecher: x.VERTRETER.String,
								Datum:      x.DATUM.Time,
								Kunde:      x.NAME.String,
							})
							gesamtWert += x.ENDPRB.Float64
						}
					}
				}
			} else {
				if x.ENDPRB.Valid {
					verbrecher = append(verbrecher, Response{
						Auftrag:    x.AUFNR.String,
						Wert:       x.ENDPRB.Float64,
						Verbrecher: x.VERTRETER.String,
						Datum:      x.DATUM.Time,
						Kunde:      x.NAME.String,
					})
					gesamtWert += x.ENDPRB.Float64
				}
			}
		}
	}

	// Verbrecher sortieren nach Datum
	sort.Slice(verbrecher, func(i, j int) bool {
		return verbrecher[i].Datum.Before(verbrecher[j].Datum)
	})

	return verbrecher, gesamtWert, nil
}
