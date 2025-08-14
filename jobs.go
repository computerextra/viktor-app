package main

import (
	"fmt"
	"viktor/db"

	"github.com/lucsky/cuid"
)

type JobProps struct {
	Name   string
	Online bool
}

func (a *App) GetJobs() []db.Job {
	res, err := a.db.GetJobs(a.ctx)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return nil
	}
	return res
}

func (a *App) GetJob(id string) *db.Job {
	res, err := a.db.GetJob(a.ctx, id)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return nil
	}
	return &res
}

func (a *App) CreateJob(props JobProps) bool {
	_, err := a.db.CreateJob(a.ctx, db.CreateJobParams{
		ID:     cuid.New(),
		Name:   props.Name,
		Online: props.Online,
	})
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}
	return true
}

func (a *App) UpdateJob(id string, props JobProps) bool {
	err := a.db.UpdateJob(a.ctx, db.UpdateJobParams{
		Name:   props.Name,
		Online: props.Online,
		ID:     id,
	})
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}
	return true
}

func (a *App) DeleteJob(id string) bool {
	err := a.db.DeleteJob(a.ctx, id)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("Datenbank Fehler: %s", err.Error()))
		return false
	}
	return true
}
