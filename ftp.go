package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"runtime"
	"strconv"
	"time"

	"github.com/jlaffaye/ftp"
	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

const UPDATE_URL = "https://bilder.computer-extra.de/data/viktor/Viktor.exe"

func (a *App) CheckVersion() bool {
	remoteFile := a.config.FTP_UPLOAD_PATH + "viktor/version.txt"
	ftpClient, err := ftp.Dial(fmt.Sprintf("%s:%v", a.config.FTP_SERVER, a.config.FTP_PORT), ftp.DialWithTimeout(5*time.Second))
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("FTP Fehler: %s", err.Error()))
		return false
	}
	defer ftpClient.Quit()

	if err := ftpClient.Login(a.config.FTP_USER, a.config.FTP_PASS); err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("FTP Fehler: %s", err.Error()))
		return false
	}

	res, err := ftpClient.Retr(remoteFile)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("FTP Fehler: %s", err.Error()))
		return false
	}
	defer res.Close()

	buf, err := io.ReadAll(res)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("FTP Fehler: %s", err.Error()))
		return false
	}

	ver, err := strconv.ParseFloat(string(buf), 64)
	if err != nil {
		a.showErrorDialog("Fehler", fmt.Sprintf("FTP Fehler: %s", err.Error()))
		return false
	}
	if ver != VERSION {
		x, err := wailsruntime.MessageDialog(a.ctx, wailsruntime.MessageDialogOptions{
			Title:         "Update",
			Message:       "Ein Update ist verfügbar, bitte herunterladen. Ohne dieses Update funktioniert die App nicht.",
			DefaultButton: "Ok",
			CancelButton:  "Abbrechen",
		})
		if err != nil {
			panic(err)
		}
		if x == "Ok" {
			var cmd string
			var args []string

			switch runtime.GOOS {
			case "windows":
				cmd = "cmd"
				args = []string{"/c", "start"}
			case "darwin":
				cmd = "open"
			default:
				cmd = "xdg-open"
			}
			args = append(args, UPDATE_URL)
			exec.Command(cmd, args...).Start()
			os.Exit(0)
		} else {
			os.Exit(1)
		}
	}

	return true
}
