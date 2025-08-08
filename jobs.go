package main

import (
	"viktor/db"

	"github.com/lucsky/cuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type JobProps struct {
	Name   string
	Online bool
}

func (a *App) GetJobs() []db.Job {
	res, err := a.db.GetJobs(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return res
}

func (a *App) GetJob(id string) *db.Job {
	res, err := a.db.GetJob(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
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
		runtime.LogError(a.ctx, err.Error())
		return true
	}
	return false
}

func (a *App) UpdateJob(id string, props JobProps) bool {
	err := a.db.UpdateJob(a.ctx, db.UpdateJobParams{
		Name:   props.Name,
		Online: props.Online,
		ID:     id,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) DeleteJob(id string) bool {
	err := a.db.DeleteJob(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}
