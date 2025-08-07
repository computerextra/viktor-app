-- name: GetMitarbeiter :many
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
INSERT INTO Einkauf 
(id, Paypal, Abonniert, Geld, Pfand, Dinge, Bild1, Bild2, Bild3, Abgeschickt) 
VALUES 
(?,?,?,?,?,?,?,?,?,?);

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