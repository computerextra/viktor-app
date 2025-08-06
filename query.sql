-- name: GetGeburtstagsliste :many
SELECT * FROM Mitarbeiter 
ORDER BY name ASC;

-- name: GetEinkaufsliste :many
SELECT  
Mitarbeiter.id, Mitarbeiter.name, Einkauf.Dinge, Einkauf.Paypal, 
Einkauf.Abonniert, Einkauf.Geld, Einkauf.Pfand, Einkauf.Abgeschickt, 
Einkauf.Bild1, Einkauf.Bild2, Einkauf.Bild3 
FROM Mitarbeiter 
LEFT JOIN Einkauf ON Mitarbeiter.einkaufId = Einkauf.id 
WHERE DATEDIFF(NOW(), Einkauf.Abgeschickt) = 1 
OR Einkauf.Abonniert;