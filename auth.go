package main

import (
	"encoding/json"
	"fmt"
	"slices"
	"viktor/db"

	wailsconfigstore "github.com/AndreiTelteu/wails-configstore"
	"github.com/lucsky/cuid"
	"golang.org/x/crypto/bcrypt"
)

var AllowedAdmins = []string{
	"johannes.kirchner@computer-extra.de",
	"christoph.salowski@computer-extra.de",
}

type AuthState struct {
	Username string `json:"username"`
	Mail     string `json:"mail"`
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func (a *App) GetAuthState() *AuthState {
	data, err := a.auth.Get("server.json", `{"username": ""}`)
	if err != nil {
		a.showErrorDialog("Fehler", "Fehler beim auslesen der Config Datei.")
		return nil
	}
	var authState AuthState
	err = json.Unmarshal([]byte(data), &authState)
	if err != nil {
		a.showErrorDialog("Fehler", "Server Config konnte nicht gelesen werden")
		return nil
	}
	return &authState
}

func (a *App) Login(mail, password string) *AuthState {
	user, err := a.db.GetUser(a.ctx, mail)
	if err != nil {
		a.showErrorDialog("Fehler", "E-Mail Adresse oder Password sind falsch")
		return nil
	}
	ok := checkPasswordHash(password, user.Password)
	if !ok {
		a.showErrorDialog("Fehler", "E-Mail Adresse oder Password sind falsch")
		return nil
	}
	err = a.auth.Set("server.json", wailsconfigstore.Config(fmt.Sprintf(`{"username": %s, "mail": %s}`, user.Username, mail)))
	if err != nil {
		a.showErrorDialog("Fehler", "Benutzer konnte nicht angemeldet werden")
		return nil
	}
	return a.GetAuthState()
}

func (a *App) Logout() bool {
	err := a.auth.Set("server.json", wailsconfigstore.Config(""))
	if err != nil {
		a.showErrorDialog("Fehler", "Benutzer konnte nicht abgemeldet werden")
		return false
	}
	return true
}

func (a *App) Register(mail, username, password string) *AuthState {
	hash, err := hashPassword(password)
	if err != nil {
		a.showErrorDialog("Fehler", "Fehler beim erstellen eines Passwort Hashes")
		return nil
	}
	_, err = a.db.CreateUser(a.ctx, db.CreateUserParams{
		ID:       cuid.New(),
		Username: username,
		Mail:     mail,
		Password: hash,
	})
	if err != nil {
		a.showErrorDialog("Fehler", "Benutzer konnte nicht angelegt werden")
		return nil
	}

	return a.Login(mail, password)
}

func (a *App) CheckAdmin() bool {
	auth := a.GetAuthState()
	if auth.Username == "" {
		return false
	}
	if slices.Contains(AllowedAdmins, auth.Mail) {
		return true
	}
	return false
}
