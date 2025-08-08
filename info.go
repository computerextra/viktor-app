package main

import (
	"crypto/tls"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	gomail "gopkg.in/gomail.v2"
)

type InfoProps struct {
	Mail    string
	Auftrag string
}

func (a *App) SendInfoMail(props InfoProps) bool {
	d := gomail.NewDialer(
		a.config.SMTP_HOST,
		a.config.SMTP_PORT,
		a.config.SMTP_USER,
		a.config.SMTP_PASS,
	)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}
	s, err := d.Dial()
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}

	m := gomail.NewMessage()
	m.SetHeader("From", a.config.SMTP_FROM)
	m.SetHeader("To", props.Mail)
	m.SetHeader("Bcc", a.config.SMTP_FROM)
	m.SetHeader("Subject", fmt.Sprintf("Ihre Bestellung %s", props.Auftrag))
	m.SetBody("text/html", getInfoMailBody())
	err = gomail.Send(s, m)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return false
	}
	return true
}
