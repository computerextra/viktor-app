import { useEffect, useState } from "react";
import { GetEinkaufsliste } from "../../wailsjs/go/main/App";
import { db } from "../../wailsjs/go/models";

export default function Einkauf() {
  const [Liste, setListe] = useState<undefined | db.GetEinkaufslisteRow[]>();

  useEffect(() => {
    (async () => {
      const res = await GetEinkaufsliste();
      setListe(res);
    })();
  }, []);

  return (
    <>
      <h1>Einkaufsliste</h1>
      {Liste?.map((entry) => (
        <div key={entry.ID}>
          <span>{entry.Name}</span> <br />
          <span>
            Geld: {entry.Geld.String} <br />
            Pfand: {entry.Pfand.String} <br />
          </span>
          <span>
            Paypal: {entry.Paypal.Bool ? "✔️" : "❌"} <br />
            Abo: {entry.Abonniert.Bool ? "✔️" : "❌"}
          </span>
          <pre>{entry.Dinge.String}</pre>
          <hr />
        </div>
      ))}
    </>
  );
}
