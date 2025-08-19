package main

import (
	"fmt"

	"codeberg.org/go-pdf/fpdf"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const A4_WIDTH = 210

type AoemeiProps struct {
	Lizenz       string
	Gerätenummer string
}

func (a *App) GenerateAomei(props AoemeiProps) bool {
	file, err := runtime.SaveFileDialog(
		a.ctx,
		runtime.SaveDialogOptions{
			DefaultFilename: "Aomei-Formular.pdf",
		},
	)
	if err != nil {
		a.showErrorDialog("Fehler", "Datei kann nicht geschrieben werden")
		return false
	}
	pdf := fpdf.New("P", "mm", "A4", "")
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.AddPage()

	pdf.SetFont("Arial", "B", 30)
	pdf.CellFormat(0, 10, "AOMEI Backupper Pro", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("für 2 Computer"), "", 1, "C", false, 0, "")
	pdf.ImageOptions("images/aomei.png", (A4_WIDTH-120)/2, 555, 120, 0, true, fpdf.ImageOptions{
		AllowNegativePosition: false,
		ReadDpi:               true,
	}, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Lizenzschlüssel:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Lizenz), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Installiert auf Gerät:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Gerätenummer), "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, tr("Bitte heben Sie diese Zugangsdaten"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sorgfältig auf, sie werden benötigt, wenn Sie"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sich erneut in AOMEI anmelden möchten."), "", 1, "C", false, 0, "")

	err = pdf.OutputFileAndClose(file)
	if err != nil {
		a.showErrorDialog("Fehler", "Konnte Datei nicht speichern")
		return false
	}
	return true
}

type AppleProps struct {
	Kundennummer string
	Benutzername string
	Passwort     string
}

func (a *App) GenerateApple(props AppleProps) bool {
	file, err := runtime.SaveFileDialog(
		a.ctx,
		runtime.SaveDialogOptions{
			DefaultFilename: "Apple-Formular.pdf",
		},
	)
	if err != nil {
		a.showErrorDialog("Fehler", "Datei kann nicht geschrieben werden")
		return false
	}
	kunde := a.KundenFormularSuche(props.Kundennummer)
	if kunde == nil {
		a.showErrorDialog("Fehler", "Finde keinen Kunden mit der angegebenen Kundennummer")
		return false
	}

	pdf := fpdf.New("P", "mm", "A4", "")
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.AddPage()

	pdf.SetFont("Arial", "B", 30)
	pdf.CellFormat(0, 10, "Apple ID Zugangsdaten", "", 1, "C", false, 0, "")
	pdf.ImageOptions("images/apple.png", (A4_WIDTH-120)/2, 555, 120, 0, true, fpdf.ImageOptions{
		AllowNegativePosition: false,
		ReadDpi:               true,
	}, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Kundennummer:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Kundennummer), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Name:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(fmt.Sprintf("%s %s", kunde.Vorname, kunde.Name)), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Benutzername:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Benutzername), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Passwort:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Passwort), "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, tr("Bitte heben Sie diese Zugangsdaten"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sorgfältig auf, sie werden benötigt, wenn Sie"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sich erneut bei Apple anmelden möchten."), "", 1, "C", false, 0, "")

	err = pdf.OutputFileAndClose(file)
	if err != nil {
		a.showErrorDialog("Fehler", "Konnte Datei nicht speichern")
		return false
	}
	return true
}

type GDataProps struct {
	Benutzername string
	Passwort     string
	Benutzer     int
	Anwendung    string
	Lizenz       string
}

func (a *App) GenerateGdata(props GDataProps) bool {
	file, err := runtime.SaveFileDialog(
		a.ctx,
		runtime.SaveDialogOptions{
			DefaultFilename: "GData-Formular.pdf",
		},
	)
	if err != nil {
		a.showErrorDialog("Fehler", "Datei kann nicht geschrieben werden")
		return false
	}

	pdf := fpdf.New("P", "mm", "A4", "")
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.AddPage()

	pdf.SetFont("Arial", "B", 30)
	pdf.CellFormat(0, 10, "G Data Zugangsdaten", "", 1, "C", false, 0, "")
	pdf.ImageOptions("images/gdata.png", (A4_WIDTH-120)/2, 555, 120, 0, true, fpdf.ImageOptions{
		AllowNegativePosition: false,
		ReadDpi:               true,
	}, 0, "")

	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(fmt.Sprintf("%v für %v Benutzer", props.Anwendung, props.Benutzer)), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Lizenzschlüssel:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Lizenz), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Benutzername:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Benutzername), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Passwort:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Passwort), "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, tr("Bitte heben Sie diese Zugangsdaten"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sorgfältig auf, sie werden benötigt, wenn Sie"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sich erneut in G Data anmelden möchten."), "", 1, "C", false, 0, "")

	err = pdf.OutputFileAndClose(file)
	if err != nil {
		a.showErrorDialog("Fehler", "Konnte Datei nicht speichern")
		return false
	}
	return true
}

type GoogleProps struct {
	Kundennummer string
	Benutzername string
	Passwort     string
}

func (a *App) GenerateGoogle(props GoogleProps) bool {
	file, err := runtime.SaveFileDialog(
		a.ctx,
		runtime.SaveDialogOptions{
			DefaultFilename: "Google-Formular.pdf",
		},
	)
	if err != nil {
		a.showErrorDialog("Fehler", "Datei kann nicht geschrieben werden")
		return false
	}
	kunde := a.KundenFormularSuche(props.Kundennummer)
	if kunde == nil {
		a.showErrorDialog("Fehler", "Finde keinen Kunden mit der angegebenen Kundennummer")
		return false
	}

	pdf := fpdf.New("P", "mm", "A4", "")
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.AddPage()

	pdf.SetFont("Arial", "B", 30)
	pdf.CellFormat(0, 10, "Google Zugangsdaten", "", 1, "C", false, 0, "")
	pdf.ImageOptions("images/google.png", (A4_WIDTH-120)/2, 555, 120, 0, true, fpdf.ImageOptions{
		AllowNegativePosition: false,
		ReadDpi:               true,
	}, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Kundennummer:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Kundennummer), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Name:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(fmt.Sprintf("%s %s", kunde.Vorname, kunde.Name)), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Benutzername:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Benutzername), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Passwort:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Passwort), "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, tr("Bitte heben Sie diese Zugangsdaten"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sorgfältig auf, sie werden benötigt, wenn Sie"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sich erneut bei Google anmelden möchten."), "", 1, "C", false, 0, "")

	err = pdf.OutputFileAndClose(file)
	if err != nil {
		a.showErrorDialog("Fehler", "Konnte Datei nicht speichern")
		return false
	}
	return true
}

type MicrosoftProps struct {
	Kundennummer string
	Benutzername string
	Passwort     string
	Email        string
	Mobil        string
}

func (a *App) GenerateMicrosoft(props MicrosoftProps) bool {
	file, err := runtime.SaveFileDialog(
		a.ctx,
		runtime.SaveDialogOptions{
			DefaultFilename: "Microsoft-Formular.pdf",
		},
	)
	if err != nil {
		a.showErrorDialog("Fehler", "Datei kann nicht geschrieben werden")
		return false
	}
	kunde := a.KundenFormularSuche(props.Kundennummer)
	if kunde == nil {
		a.showErrorDialog("Fehler", "Finde keinen Kunden mit der angegebenen Kundennummer")
		return false
	}

	pdf := fpdf.New("P", "mm", "A4", "")
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.AddPage()

	pdf.SetFont("Arial", "B", 30)
	pdf.CellFormat(0, 10, "Microsoft Zugangsdaten", "", 1, "C", false, 0, "")
	pdf.ImageOptions("images/microsoft.jpg", (A4_WIDTH-120)/2, 555, 120, 0, true, fpdf.ImageOptions{
		AllowNegativePosition: false,
		ReadDpi:               true,
	}, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Kundennummer:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Kundennummer), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Name:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(fmt.Sprintf("%s %s", kunde.Vorname, kunde.Name)), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Benutzername:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Benutzername), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Passwort:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Passwort), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Alternative E-Mail-Adresse:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Email), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Mobilfunk:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Mobil), "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, tr("Bitte heben Sie diese Zugangsdaten"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sorgfältig auf, sie werden benötigt, wenn Sie"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sich erneut bei Microsoft anmelden möchten."), "", 1, "C", false, 0, "")

	err = pdf.OutputFileAndClose(file)
	if err != nil {
		a.showErrorDialog("Fehler", "Konnte Datei nicht speichern")
		return false
	}
	return true
}

type TelekomProps struct {
	Kundennummer     string
	Benutzername     string
	Passwort         string
	Mobil            string
	Geburtstag       string
	Sicherheitsfrage string
	Antwort          string
}

func (a *App) GenerateTelekom(props TelekomProps) bool {
	file, err := runtime.SaveFileDialog(
		a.ctx,
		runtime.SaveDialogOptions{
			DefaultFilename: "Telekom-Formular.pdf",
		},
	)
	if err != nil {
		a.showErrorDialog("Fehler", "Datei kann nicht geschrieben werden")
		return false
	}
	kunde := a.KundenFormularSuche(props.Kundennummer)
	if kunde == nil {
		a.showErrorDialog("Fehler", "Finde keinen Kunden mit der angegebenen Kundennummer")
		return false
	}

	pdf := fpdf.New("P", "mm", "A4", "")
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.AddPage()

	pdf.SetFont("Arial", "B", 30)
	pdf.CellFormat(0, 10, "Telekom E-Mail Zugangsdaten", "", 1, "C", false, 0, "")
	pdf.ImageOptions("images/telekom.jpg", (A4_WIDTH-120)/2, 555, 120, 0, true, fpdf.ImageOptions{
		AllowNegativePosition: false,
		ReadDpi:               true,
	}, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr("Für:"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr(fmt.Sprintf("%s - %s %s", kunde.Kundennummer, kunde.Vorname, kunde.Name)), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Benutzername:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Benutzername), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Passwort:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Passwort), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Mobilfunk:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Mobil), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Geburtstag:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Geburtstag), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.CellFormat(0, 10, tr("Sicherheitsfrage:"), "", 1, "C", false, 0, "")
	pdf.SetFont("Arial", "", 16)
	pdf.CellFormat(0, 10, tr(props.Passwort), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr(fmt.Sprintf("Antwort: %s", props.Antwort)), "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, "", "", 1, "C", false, 0, "")

	pdf.CellFormat(0, 10, tr("Bitte heben Sie diese Zugangsdaten"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sorgfältig auf, sie werden benötigt, wenn Sie"), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 10, tr("sich erneut bei Telekom anmelden möchten."), "", 1, "C", false, 0, "")

	err = pdf.OutputFileAndClose(file)
	if err != nil {
		a.showErrorDialog("Fehler", "Konnte Datei nicht speichern")
		return false
	}
	return true
}
