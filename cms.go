package main

import (
	"viktor/db"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) GetCmsCount() *db.GetCountRow {
	res, err := a.db.GetCount(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return &res
}
