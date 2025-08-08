package main

import (
	"viktor/db"

	"github.com/lucsky/cuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) GetPartners() []db.Partner {
	res, err := a.db.GetPartners(a.ctx)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return res
}

func (a *App) GetParnter(id string) *db.Partner {
	res, err := a.db.GetPartner(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return nil
	}
	return &res
}

type PartnerProps struct {
	Name  string
	Link  string
	Image string
}

func (a *App) CreatePartner(props PartnerProps) bool {
	_, err := a.db.CreatePartner(a.ctx, db.CreatePartnerParams{
		ID:    cuid.New(),
		Name:  props.Name,
		Link:  props.Link,
		Image: props.Image,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) UpdatePartner(id string, props PartnerProps) bool {
	err := a.db.UpdatePartner(a.ctx, db.UpdatePartnerParams{
		Name:  props.Name,
		Link:  props.Link,
		Image: props.Link,
		ID:    id,
	})
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}

func (a *App) DeletePartner(id string) bool {
	err := a.db.DeletePartner(a.ctx, id)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}
