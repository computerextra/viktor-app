-- Abteilungen --

-- name: GetAbteilungen :many
SELECT * FROM Abteilung
ORDER BY name ASC;

-- name: GetAbteilung :one
SELECT * FROM Abteilung
WHERE id=? LIMIT 1;

-- name: CreateAbteilung :execresult
INSERT INTO Abteilung (id, name) VALUES (?,?);

-- name: UpdateAbteilung :exec
UPDATE Abteilung SET name=? WHERE id=?;

-- name: DeleteAbteilung :exec
DELETE FROM Abteilung WHERE id=?;

-- Angebote

-- name: GetAngebote :many
SELECT * FROM Angebot;

-- name: GetAngebot :one
SELECT * FROM Angebot WHERE id=? LIMIT 1;

-- name: CreateAngebot :execresult
INSERT INTO Angebot (
    id, title,  subtitle,   date_start, 
    date_stop,  link,       image,  
    anzeigen
) VALUES (
    ?,  ?,      ?,          ?,
    ?,          ?,          ?,
    ?
);

-- name: UpdateAngebot :exec
UPDATE Angebot SET 
title=?, subtitle=?, date_start=?, 
date_stop=?, link=?, image=?, anzeigen=?
WHERE id=?;

-- name: ToggleAngebot :exec
UPDATE Angebot SET anzeigen=? WHERE id=?;

-- name: DeleteAngebot :exec
DELETE FROM Angebot WHERE id=?;

-- Ansprechpartner --

-- name: GetAnsprechpartnerFromLieferant :many
SELECT * FROM Ansprechpartner WHERE lieferantId=? 
ORDER BY name ASC;

-- name: GetAnsprechpartner :one
SELECT * FROM Ansprechpartner WHERE id=? LIMIT 1;

-- name: CreateAnsprechpartner :execresult
INSERT INTO Ansprechpartner (
    id, name,   telefon,    mobil,  mail,   lieferantId
) VALUES (
    ?,  ?,      ?,          ?,      ?,      ?
);

-- name: UpdateAnsprechpartner :exec
UPDATE Ansprechpartner 
SET name=?, telefon=?, mobil=?, mail=?
WHERE id=?;

-- name: DeleteAnsprechpartner :exec
DELETE FROM Ansprechpartner WHERE id=?;

-- Aussteller --

-- name: UpdateAusteller :exec
UPDATE Aussteller SET Bild=? WHERE Artikelnummer=?;

-- Einkauf --

-- name: GetEinkaufsliste :many
SELECT  
Mitarbeiter.id, Mitarbeiter.name, Einkauf.Dinge, Einkauf.Paypal, 
Einkauf.Abonniert, Einkauf.Geld, Einkauf.Pfand, Einkauf.Abgeschickt, 
Einkauf.Bild1, Einkauf.Bild2, Einkauf.Bild3 
FROM Mitarbeiter 
LEFT JOIN Einkauf ON Mitarbeiter.einkaufId = Einkauf.id 
WHERE DATEDIFF(NOW(), Einkauf.Abgeschickt) = 1 
OR Einkauf.Abonniert;

-- name: GetEinkauf :one
SELECT 
Mitarbeiter.id, Mitarbeiter.name, 
Einkauf.id as Einkauf_Id, 
Einkauf.Paypal, Einkauf.Abonniert, 
Einkauf.Geld, Einkauf.Pfand, 
Einkauf.Dinge, Einkauf.Abgeschickt,
Einkauf.Bild1, Einkauf.Bild2, Einkauf.Bild3
FROM Mitarbeiter 
LEFT JOIN Einkauf ON Mitarbeiter.einkaufId = Einkauf.id 
WHERE Mitarbeiter.id = ? 
LIMIT 1;

-- name: CheckEinkauf :one
SELECT Einkauf.id 
from Mitarbeiter 
RIGHT JOIN Einkauf ON Mitarbeiter.einkaufId = Einkauf.id 
WHERE Mitarbeiter.id = ? 
LIMIT 1;

-- name: CreateEinkauf :exec
INSERT INTO Einkauf (
    id,         Paypal, Abonniert, 
    Geld,       Pfand,  Dinge, 
    Bild1,      Bild2,  Bild3, 
    Abgeschickt
) 
VALUES 
(
    ?,          ?,      ?,
    ?,          ?,      ?,
    ?,          ?,      ?,
    ?
);

-- name: UpdateEinkauf :exec
UPDATE Einkauf 
SET Paypal=?, Abonniert=?, Geld=?, Pfand=?, Dinge=?, Abgeschickt=?, Bild1=?, Bild2=?, Bild3=? 
WHERE id=?;

-- name: LinkEinkauf :exec
UPDATE Mitarbeiter
SET einkaufId=?
WHERE id=?;

-- name: SkipEinkauf :exec
UPDATE Einkauf SET Abgeschickt=? WHERE id=?;

-- name: DeleteEinkauf :exec
UPDATE Einkauf SET Abgeschickt=?, Abonniert=? WHERE id=?;

-- Jobs --

-- name: GetJobs :many
SELECT * FROM Jobs ORDER BY name ASC;

-- name: GetJob :one
SELECT * FROM Jobs WHERE id=? LIMIT 1;

-- name: CreateJob :execresult
INSERT INTO Jobs (id, name, online) VALUES (?,?,?);

-- name: UpdateJob :exec
UPDATE Jobs SET name=?, online=? WHERE id=?;

-- name: DeleteJob :exec
DELETE FROM Jobs WHERE id=?;

-- Lieferanten --

-- name: GetLieferanten :many
SELECT * FROM Lieferant ORDER BY Firma ASC;

-- name: GetLieferant :one
SELECT * FROM Lieferant WHERE id=? LIMIT 1;

-- name: CreateLieferant :execresult
INSERT INTO Lieferant (
    id, Firma,  Kundennummer,   Webseite
) VALUES (
    ?,  ?,      ?,              ?
);

-- name: UpdateLieferant :exec
UPDATE Lieferant SET Firma=?, Kundennummer=?, Webseite=? WHERE id=?;

-- name: DeleteLieferant :exec
DELETE Lieferant, Ansprechpartner 
FROM Lieferant
LEFT JOIN Ansprechpartner 
ON Lieferant.id = Ansprechpartner.lieferantId
WHERE Lieferant.id=?;

-- Mitarbeiter --

-- name: GetMitarbeiter :many
SELECT * FROM Mitarbeiter 
ORDER BY name ASC;

-- name: GetOneMitarbeiter :one
SELECT * FROM Mitarbeiter WHERE id=? LIMIT 1;

-- name: GetMitarbeiterWithAbteilung :many
SELECT Mitarbeiter.id, Mitarbeiter.name, 
Mitarbeiter.short, Mitarbeiter.sex, 
Mitarbeiter.focus, Mitarbeiter.mail, 
Mitarbeiter.abteilungId,
Abteilung.id as Abteilung_Id, 
Abteilung.name as Abteilung_Name 
FROM Mitarbeiter 
LEFT JOIN Abteilung ON Mitarbeiter.abteilungId = Abteilung.id 
ORDER BY Mitarbeiter.name ASC;

-- name: GetOneMitarbeiterWithAbteilung :one
SELECT Mitarbeiter.id, Mitarbeiter.name, 
Mitarbeiter.short, Mitarbeiter.sex, 
Mitarbeiter.focus, Mitarbeiter.mail, 
Mitarbeiter.abteilungId,
Abteilung.id as Abteilung_Id, 
Abteilung.name as Abteilung_Name 
FROM Mitarbeiter 
LEFT JOIN Abteilung ON Mitarbeiter.abteilungId = Abteilung.id 
WHERE Mitarbeiter.id = ? LIMIT 1;

-- name: CreateMitarbeiter :execresult
INSERT INTO Mitarbeiter (
    id,                 name,               short,  
    image,              sex,                focus, 
    mail,               abteilungId,        einkaufId,  
    Azubi,              Geburtstag,         Gruppenwahl,    
    HomeOffice,         Mobil_Business,     Mobil_Privat,   
    Telefon_Intern_1,   Telefon_Intern_2,   Telefon_Privat
) VALUES (
    ?,                  ?,                  ?,
    ?,                  ?,                  ?,
    ?,                  ?,                  NULL,
    ?,                  ?,                  ?,
    ?,                  ?,                  ?,
    ?,                  ?,                  ?
);

-- name: UpdateMitarbeiter :exec
UPDATE Mitarbeiter SET 
name=?, short=?, image=?, sex=?, focus=?, 
mail=?, abteilungId=?, Azubi=?,
Geburtstag=?, Gruppenwahl=?, HomeOffice=?,
Mobil_Business=?, Mobil_Privat=?, Telefon_Intern_1=?, 
Telefon_Intern_2=?, Telefon_Privat=?
WHERE id=?;

-- name: DeleteMitarbeiter :exec
DELETE Mitarbeiter, Einkauf 
FROM Mitarbeiter 
LEFT JOIN Einkauf ON Einkauf.id = Mitarbeiter.einkaufId 
WHERE Mitarbeiter.id=?;

-- Partner --

-- name: GetPartners :many
SELECT * FROM Partner ORDER BY name ASC;

-- name: GetPartner :one
SELECT * FROM Partner WHERE id=? LIMIT 1;

-- name: CreatePartner :execresult
INSERT INTO Partner (
    id, name,   link,   image
) VALUES (
    ?,  ?,      ?,      ?
);

-- name: UpdatePartner :exec
UPDATE Partner SET name=?, link=?, image=? WHERE id=?;

-- name: DeletePartner :exec
DELETE FROM Partner WHERE id=?;

-- PDFs --

-- name: SearchArchive :many
SELECT id, title FROM Pdfs WHERE body LIKE ? OR title LIKE ?;

-- name: GetPdf :one
SELECT title FROM Pdfs WHERE id=? LIMIT 1;

-- Status --

-- name: GetStatus :one
SELECT * FROM Status LIMIT 1;

-- User --

-- name: CreateUser :execresult
INSERT INTO User (id, Username, Mail, Password) VALUES (?,?,?,?);

-- name: GetUser :one
SELECT * FROM User WHERE Username=? LIMIT 1;

-- name: DeleteUser :exec
DELETE FROM User WHERE Mail=?;


-- Warenlieferung --

-- name: GetWarenlieferung :many
SELECT * FROM Warenlieferung;

-- name: CreateWarenlieferung :exec
INSERT INTO Warenlieferung (
    id,         Name,       angelegt,   geliefert,
    AlterPreis, NeuerPreis, Preis,      Artikelnummer
) VALUES (
    ?,          ?,          NOW(),          ?,
    ?,          ?,          ?,          ?
);

-- name: UpdateLieferung :exec
UPDATE Warenlieferung SET 
Name=?, geliefert=NOW()
WHERE id=?;

-- name: UpdatePreis :exec
UPDATE Warenlieferung SET 
AlterPreis=?, NeuerPreis=?, Preis=?
WHERE id=?;

-- name: GetNeueArtikel :many
SELECT * FROM Warenlieferung
WHERE DATE_FORMAT(angelegt, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d')
ORDER BY Artikelnummer ASC;

-- name: GetGelieferteArtikel :many
SELECT * FROM Warenlieferung
WHERE DATE_FORMAT(geliefert, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d')
AND DATE_FORMAT(angelegt, '%Y-%m-%d') != DATE_FORMAT(NOW(), '%Y-%m-%d')
ORDER BY Artikelnummer ASC;

-- name: GetNeuePreise :many
SELECT * FROM Warenlieferung
WHERE DATE_FORMAT(Preis, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d')
AND DATE_FORMAT(angelegt, '%Y-%m-%d') != DATE_FORMAT(NOW(),'%Y-%m-%d')
ORDER BY Artikelnummer ASC;

-- CMS --

-- name: GetCount :one
SELECT
	(SELECT COUNT(Abteilung.id) FROM Abteilung) as Abteilungen,
    (SELECT COUNT(Angebot.id) FROM Angebot) as Angebote,
    (SELECT COUNT(Jobs.id) FROM Jobs) as Jobs,
    (SELECT COUNT(Mitarbeiter.id) FROM Mitarbeiter) as Mitarbeiter,
    (SELECT COUNT(Partner.id) FROM Partner) as Partner;
