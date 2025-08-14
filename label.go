package main

import (
	"database/sql"
	"fmt"
	"strings"

	_ "github.com/mattn/go-adodb"
)

type AccessArtikel struct {
	Id            int
	Artikelnummer string
	Artikeltext   string
	Preis         float64
}

func (a *App) SyncLabel() bool {
	sage, err := a.getAllProducts()
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}
	label, err := a.readAccessDb()
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}

	var updates []AccessArtikel
	var create []AccessArtikel

	for _, sageItem := range sage {
		found := false
		for _, labelItem := range label {
			if sageItem.Id == labelItem.Id {
				found = true
				break
			}
		}
		art := AccessArtikel{
			Id:            sageItem.Id,
			Artikelnummer: sageItem.Artikelnummer,
			Preis:         sageItem.Preis,
			Artikeltext:   sageItem.Suchbegriff,
		}
		if found {
			updates = append(updates, art)
		} else {
			create = append(create, art)
		}
	}

	err = a.insert(create)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}
	err = a.update(updates)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}

	return true
}

func (a *App) insert(items []AccessArtikel) error {
	conn, err := sql.Open("adodb", fmt.Sprintf("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=%s;", a.config.ACCESS_DB))
	if err != nil {
		return err
	}
	defer conn.Close()

	query := "INSERT INTO Artikel (ID, Artikelnummer, Artikeltext, Preis) VALUES"

	for i, a := range items {
		if i == len(items)-1 {
			query = fmt.Sprintf("%s (%v, %s, %s, %v)", query, a.Id, a.Artikelnummer, strings.ReplaceAll(a.Artikeltext, "'", "\""), a.Preis)
		} else {
			query = fmt.Sprintf("%s (%v, %s, %s, %v),", query, a.Id, a.Artikelnummer, strings.ReplaceAll(a.Artikeltext, "'", "\""), a.Preis)
		}
	}
	_, err = conn.Exec(query)
	return err
}

func (a *App) update(items []AccessArtikel) error {
	conn, err := sql.Open("adodb", fmt.Sprintf("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=%s;", a.config.ACCESS_DB))
	if err != nil {
		return err
	}
	defer conn.Close()

	stmt, err := conn.Prepare("UPDATE Artikel SET Artikelnummer=?, Artikeltext=?, Preis=? WHERE id=?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, item := range items {
		if _, err := stmt.Exec(item.Artikelnummer, strings.ReplaceAll(item.Artikeltext, "'", "\""), item.Preis, item.Id); err != nil {
			return err
		}
	}

	return nil
}

func (a *App) readAccessDb() ([]AccessArtikel, error) {
	conn, err := sql.Open("adodb", fmt.Sprintf("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=%s;", a.config.ACCESS_DB))
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	rows, err := conn.Query("SELECT ID, Artikelnummer, Artikeltext. Preis FROM Artikel")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var Artikel []AccessArtikel

	for rows.Next() {
		var art AccessArtikel
		if err := rows.Scan(&art.Id, &art.Artikelnummer, &art.Artikeltext, &art.Preis); err != nil {
			return nil, err
		}
		Artikel = append(Artikel, art)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return Artikel, nil
}
