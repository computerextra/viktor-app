package main

import (
	"crypto/tls"
	"database/sql"
	"fmt"
	"strconv"
	"strings"
	"time"
	"viktor/db"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	gomail "gopkg.in/gomail.v2"
)

type Warenlieferung struct {
	Name          string
	Angelegt      time.Time
	Geliefert     sql.NullTime
	Alterpreis    sql.NullFloat64
	Neuerpreis    sql.NullFloat64
	Preis         sql.NullTime
	Artikelnummer string
	ID            int32
}

func (a *App) TestWarenlieferung() bool {
	err := a.GenerateWarenlieferung()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	err = a.sendMail([]string{"johannes.kirchner@computer-extra.de"})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) GenerateWarenlieferung() error {
	AlleArtikel, err := a.db.GetWarenlieferung(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}

	var neueArtikel, gelieferteArtikel, neuePreise []Warenlieferung
	var geliefert []int

	Sage, err := a.getAllProducts()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}
	History, err := a.getLagerHistory()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}
	Prices, err := a.getPrices()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}

	if len(AlleArtikel) <= 0 {
		for i := range Sage {
			neu := Warenlieferung{
				ID:            int32(Sage[i].Id),
				Artikelnummer: Sage[i].Artikelnummer,
				Name:          Sage[i].Suchbegriff,
			}
			neueArtikel = append(neueArtikel, neu)
		}
	} else {
		for i := range History {
			if History[i].Action == "Insert" {
				geliefert = append(geliefert, History[i].Id)
			}
		}
		for i := range Sage {
			var found bool
			found = false
			for y := 0; y < len(geliefert); y++ {
				if Sage[i].Id == geliefert[y] {
					prod := Warenlieferung{
						ID:   int32(Sage[i].Id),
						Name: Sage[i].Suchbegriff,
					}
					gelieferteArtikel = append(gelieferteArtikel, prod)
				}
			}
			for x := 0; x < len(AlleArtikel); x++ {
				if Sage[i].Id == int(AlleArtikel[x].ID) {
					found = true
					break
				}
			}
			if !found {
				neu := Warenlieferung{
					ID:            int32(Sage[i].Id),
					Artikelnummer: Sage[i].Artikelnummer,
					Name:          Sage[i].Suchbegriff,
				}
				neueArtikel = append(neueArtikel, neu)
			}
		}
		for i := range Prices {
			var temp Warenlieferung
			var found bool
			idx := 0
			if len(neuePreise) > 0 {
				for x := 0; x < len(neuePreise); x++ {
					if neuePreise[x].ID == int32(Prices[i].Id) {
						found = true
						temp = neuePreise[x]
						idx = x
					}
				}
			}
			if !found {
				temp.ID = int32(Prices[i].Id)
				temp.Preis = sql.NullTime{Time: time.Now(), Valid: true}
			}
			if Prices[i].Action == "Insert" {
				temp.Neuerpreis = sql.NullFloat64{
					Float64: Prices[i].Price,
					Valid:   true,
				}
			}
			if Prices[i].Action == "Delete" {
				temp.Alterpreis = sql.NullFloat64{
					Float64: Prices[i].Price,
					Valid:   true,
				}
			}
			if idx > 0 {
				var altFloat float64
				var neuFloat float64
				if temp.Alterpreis.Valid {
					altFloat = temp.Alterpreis.Float64
				}
				if altFloat > 0 {
					neuePreise[idx].Alterpreis = temp.Alterpreis
				}
				if temp.Neuerpreis.Valid {
					neuFloat = temp.Neuerpreis.Float64
				}
				if neuFloat > 0 {
					neuePreise[idx].Neuerpreis = temp.Neuerpreis
				}
			} else {
				neuePreise = append(neuePreise, temp)
			}
		}
	}

	for _, item := range neueArtikel {
		err := a.db.CreateWarenlieferung(a.ctx, db.CreateWarenlieferungParams{
			ID:            item.ID,
			Name:          item.Name,
			Artikelnummer: item.Artikelnummer,
			Geliefert:     sql.NullTime{Valid: false},
			Alterpreis:    sql.NullFloat64{Valid: false},
			Neuerpreis:    sql.NullFloat64{Valid: false},
			Preis:         sql.NullTime{Valid: false},
		})
		if err != nil {
			runtime.LogError(a.ctx, err.Error())
			return err
		}
	}

	for _, item := range gelieferteArtikel {
		err := a.db.UpdateLieferung(a.ctx, db.UpdateLieferungParams{
			Name: item.Name,
			ID:   item.ID,
		})
		if err != nil {
			runtime.LogError(a.ctx, err.Error())
			return err
		}
	}

	for _, item := range neuePreise {
		err := a.db.UpdatePreis(a.ctx, db.UpdatePreisParams{
			Alterpreis: item.Alterpreis,
			Neuerpreis: item.Neuerpreis,
			Preis: sql.NullTime{
				Time:  time.Now(),
				Valid: true,
			},
		})
		if err != nil {
			runtime.LogError(a.ctx, err.Error())
			return err
		}
	}

	return nil
}

func (a *App) SendWarenlieferung() bool {
	err := a.GenerateWarenlieferung()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	am, err := a.db.GetMitarbeiter(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}

	var ma []string
	for _, x := range am {
		if x.Mail.Valid && len(x.Mail.String) > 0 {
			ma = append(ma, x.Mail.String)
		}
	}

	err = a.sendMail(ma)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}

	return true
}

func (a *App) sendMail(mails []string) error {
	NeueArtikel, err := a.db.GetNeueArtikel(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}
	GelieferteArtikel, err := a.db.GetGelieferteArtikel(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}
	NeuePreise, err := a.db.GetNeuePreise(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}
	wertBestand, wertVerfügbar, err := a.getLagerWert()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}
	teureArtikel, err := a.getHighestSum()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}
	teureVerfArtikel, err := a.getHighestVerfSum()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}
	leichen, err := a.getLeichen()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}
	SN, err := a.getAlteSeriennummern()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}
	Verbrecher, gesamtWert, err := a.getOldAuftraege()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}

	var body string
	if len(NeueArtikel) > 0 {
		body = fmt.Sprintf("%s<h2>Neue Artikel</h2><ul>", body)

		for i := range NeueArtikel {
			body = fmt.Sprintf("%s<li><b>%s</b> - %s</li>", body, NeueArtikel[i].Artikelnummer, NeueArtikel[i].Name)
		}
		body = fmt.Sprintf("%s</ul>", body)
	}

	if len(GelieferteArtikel) > 0 {
		body = fmt.Sprintf("%s<br><br><h2>Gelieferte Artikel</h2><ul>", body)

		for i := range GelieferteArtikel {
			body = fmt.Sprintf("%s<li><b>%s</b> - %s</li>", body, GelieferteArtikel[i].Artikelnummer, GelieferteArtikel[i].Name)
		}
		body = fmt.Sprintf("%s</ul>", body)
	}

	if len(NeuePreise) > 0 {
		body = fmt.Sprintf("%s<br><br><h2>Preisänderungen</h2><ul>", body)

		for _, i := range NeuePreise {

			if i.Alterpreis.Valid && i.Neuerpreis.Valid && i.Alterpreis.Float64 != i.Neuerpreis.Float64 {
				body = fmt.Sprintf("%s<li><b>%s</b> - %s: %.2f ➡️ %.2f ", body, i.Artikelnummer, i.Name, i.Alterpreis.Float64, i.Neuerpreis.Float64)

				absolute := i.Neuerpreis.Float64 - i.Alterpreis.Float64
				prozent := ((i.Neuerpreis.Float64 / i.Alterpreis.Float64) * 100) - 100
				body = fmt.Sprintf("%s(%.2f %% // %.2f €)</li>", body, prozent, absolute)
			}

		}
		body = fmt.Sprintf("%s</ul>", body)
	}

	body = fmt.Sprintf("%s<h2>Aktuelle Lagerwerte</h2><p><b>Lagerwert Verfügbare Artikel:</b> %.2f €</p><p><b>Lagerwert alle lagernde Artikel:</b> %.2f €</p>", body, wertVerfügbar, wertBestand)
	body = fmt.Sprintf("%s<p>Wert in aktuellen Aufträgen: %.2f €", body, wertBestand-wertVerfügbar)
	body = fmt.Sprintf("%s<p>Offene Posten laut Sage: %.2f €* (Hier kann nicht nach bereits lagernder Ware gesucht werden!)", body, gesamtWert)

	if len(SN) > 0 {
		body = fmt.Sprintf("%s<h2>Artikel mit alten Seriennummern</h2><p>Nachfolgende Artikel sollten mit erhöhter Prioriät verkauf werden, da die Seriennummern bereits sehr alt sind. Gegebenenfalls sind die Artikel bereits außerhalb der Herstellergarantie!</p>", body)
		body = fmt.Sprintf("%s<p>Folgende Werte gelten:</p>", body)
		body = fmt.Sprintf("%s<p>Wortmann: Angebene Garantielaufzeit + 2 Monate ab Kaufdatum CompEx</p>", body)
		body = fmt.Sprintf("%s<p>Lenovo: Angegebene Garantielaufzeit ab Kauf CompEx</p>", body)
		body = fmt.Sprintf("%s<p>Bei allen anderen Herstellern gilt teilweise das Kaufdatum des Kunden. <br>Falls sich dies ändern sollte, wird es in der Aufzählung ergänzt.</p>", body)

		body = fmt.Sprintf("%s<p>Erklärungen der Farben:</p>", body)
		body = fmt.Sprintf("%s<p><span style='background-color: \"#f45865\"'>ROT:</span> Artikel ist bereits seit mehr als 2 Jahren lagernd und sollte schnellstens Verkauft werden!</p>", body)
		body = fmt.Sprintf("%s<p><span style='background-color: \"#fff200\"'>Gelb:</span> Artikel ist bereits seit mehr als 1 Jahr lagernd!</p>", body)

		body = fmt.Sprintf("%s<table><thead>", body)
		body = fmt.Sprintf("%s<tr>", body)
		body = fmt.Sprintf("%s<th>Artikelnummer</th>", body)
		body = fmt.Sprintf("%s<th>Name</th>", body)
		body = fmt.Sprintf("%s<th>Bestand</th>", body)
		body = fmt.Sprintf("%s<th>Verfügbar</th>", body)
		body = fmt.Sprintf("%s<th>Garantiebeginn des ältesten Artikels</th>", body)
		body = fmt.Sprintf("%s</tr>", body)
		body = fmt.Sprintf("%s</thead>", body)
		body = fmt.Sprintf("%s</thbody>", body)
		for i := range SN {
			year, _, _ := time.Now().Date()
			tmp := strings.Split(strings.Replace(strings.Split(SN[i].GeBeginn, "T")[0], "-", ".", -1), ".")
			year_tmp, err := strconv.Atoi(tmp[0])
			if err != nil {
				runtime.LogError(a.ctx, err.Error())
				return err
			}

			GarantieBeginn := fmt.Sprintf("%s.%s.%s", tmp[2], tmp[1], tmp[0])
			diff := year - year_tmp
			if diff >= 2 {
				body = fmt.Sprintf("%s<tr style='background-color: \"#f45865\"'>", body)
			} else if diff >= 1 {
				body = fmt.Sprintf("%s<tr style='background-color: \"#fff200\"'>", body)
			} else {
				body = fmt.Sprintf("%s<tr>", body)
			}
			body = fmt.Sprintf("%s<td>%s</td>", body, SN[i].ArtNr)
			body = fmt.Sprintf("%s<td>%s</td>", body, SN[i].Suchbegriff)
			body = fmt.Sprintf("%s<td>%v</td>", body, SN[i].Bestand)
			body = fmt.Sprintf("%s<td>%v</td>", body, SN[i].Verfügbar)
			body = fmt.Sprintf("%s<td>%s</td>", body, GarantieBeginn)
			body = fmt.Sprintf("%s</tr>", body)

		}
		body = fmt.Sprintf("%s</tbody></table>", body)
	}

	if len(teureArtikel) > 0 {
		body = fmt.Sprintf("%s<h2>Top 10: Die teuersten Artikel inkl. aktive Aufträge</h2><table><thead><tr><th>Artikelnummer</th><th>Name</th><th>Bestand</th><th>Einzelpreis</th><th>Summe</th></tr></thead><tbody>", body)

		for i := range teureArtikel {
			body = fmt.Sprintf("%s<tr><td>%s</td><td>%s</td><td>%d</td><td>%.2f €</td><td>%.2f €</td></tr>", body, teureArtikel[i].Artikelnummer, teureArtikel[i].Artikelname, teureArtikel[i].Bestand, teureArtikel[i].EK, teureArtikel[i].Summe)
		}
		body = fmt.Sprintf("%s</tbody></table>", body)
	}

	if len(teureVerfArtikel) > 0 {
		body = fmt.Sprintf("%s<h2>Top 10: Die teuersten Artikel exkl. aktive Aufträge</h2><table><thead><tr><th>Artikelnummer</th><th>Name</th><th>Bestand</th><th>Einzelpreis</th><th>Summe</th></tr></thead><tbody>", body)

		for i := range teureVerfArtikel {
			body = fmt.Sprintf("%s<tr><td>%s</td><td>%s</td><td>%d</td><td>%.2f €</td><td>%.2f €</td></tr>", body, teureVerfArtikel[i].Artikelnummer, teureVerfArtikel[i].Artikelname, teureVerfArtikel[i].Bestand, teureVerfArtikel[i].EK, teureVerfArtikel[i].Summe)

		}
		body = fmt.Sprintf("%s</tbody></table>", body)
	}

	if len(leichen) > 0 {
		body = fmt.Sprintf("%s<h2>Top 20: Leichen bei CE</h2><table><thead><tr><th>Artikelnummer</th><th>Name</th><th>Bestand</th><th>Verfügbar</th><th>Letzter Umsatz:</th><th>Wert im Lager:</th></tr></thead><tbody>", body)
		for i := range leichen {
			summe := float64(leichen[i].Verfügbar) * leichen[i].EK
			var LetzterUmsatz string
			if leichen[i].LetzterUmsatz == "1899-12-30T00:00:00Z" {
				LetzterUmsatz = "nie"
			} else {
				tmp := strings.Split(strings.Replace(strings.Split(leichen[i].LetzterUmsatz, "T")[0], "-", ".", -1), ".")
				LetzterUmsatz = fmt.Sprintf("%s.%s.%s", tmp[2], tmp[1], tmp[0])
			}
			bestand := leichen[i].Bestand
			verf := leichen[i].Verfügbar
			artNr := leichen[i].Artikelnummer
			name := leichen[i].Artikelname
			body = fmt.Sprintf("%s<tr><td>%s</td><td>%s</td><td>%d</td><td>%d</td><td>%s</td><td>%.2f€</td></tr>", body, artNr, name, bestand, verf, LetzterUmsatz, summe)
		}
		body = fmt.Sprintf("%s</tbody></table>", body)
	}

	if len(Verbrecher) > 0 {
		body = fmt.Sprintf("%s<h2>Aktuell offene Aufträge & Lieferscheine (Es können Leichen dabei sein, das lässt sich leider nicht korrekt filtern)</h2><table><thead><tr><th>Auftrag</th><th>Summe Brutto</th><th>Vertreter</th><th>Kundenname</th><th>Datum</th></tr></thead><tbody>", body)

		for _, i := range Verbrecher {
			body = fmt.Sprintf("%s<tr>", body)
			body = fmt.Sprintf("%s<td>%s</td>", body, i.Auftrag)
			body = fmt.Sprintf("%s<td>%.2f €</td>", body, i.Wert)
			body = fmt.Sprintf("%s<td>%s</td>", body, i.Verbrecher)
			body = fmt.Sprintf("%s<td>%s</td>", body, i.Kunde)
			date := strings.Split(i.Datum.Format(time.DateOnly), "-")
			body = fmt.Sprintf("%s<td>%s.%s.%s</td>", body, date[2], date[1], date[0])
			body = fmt.Sprintf("%s</tr>", body)

		}
		body = fmt.Sprintf("%s</tbody></table>", body)
	}

	d := gomail.NewDialer(a.config.SMTP_HOST, a.config.SMTP_PORT, a.config.SMTP_USER, a.config.SMTP_PASS)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}
	s, err := d.Dial()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return err
	}
	m := gomail.NewMessage()

	for _, ma := range mails {

		m.SetHeader("From", a.config.SMTP_FROM)
		m.SetHeader("To", ma)
		m.SetHeader("Subject", fmt.Sprintf("Warenlieferung vom %v", time.Now().Format(time.DateOnly)))
		m.SetBody("text/html", body)
		if err := gomail.Send(s, m); err != nil {
			runtime.LogError(a.ctx, err.Error())
			return err
		}
		m.Reset()

	}

	return nil
}
