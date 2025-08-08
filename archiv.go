package main

import (
	"fmt"
	"os"
	"path"
	"viktor/db"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) SearchArchive(search string) []db.SearchArchiveRow {
	res, err := a.db.SearchArchive(a.ctx, db.SearchArchiveParams{
		Body:  fmt.Sprintf("%%%s%%", search),
		Title: fmt.Sprintf("%%%s%%", search),
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return res
}

func (a *App) GetPdf(id int32) bool {
	pdf, err := a.db.GetPdf(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	file, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		DefaultFilename: pdf,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}

	fileWrite, err := os.Create(file)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	defer fileWrite.Close()

	pdfData, err := os.ReadFile(path.Join(a.config.ARCHIVE_PATH, pdf))
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	_, err = fileWrite.Write(pdfData)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true

}
