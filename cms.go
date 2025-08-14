package main

import (
	"fmt"
	"viktor/db"
)

func (a *App) GetCmsCount() *db.GetCountRow {
	res, err := a.db.GetCount(a.ctx)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return nil
	}
	return &res
}
