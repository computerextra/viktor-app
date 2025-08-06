import { useEffect, useState } from "react";
import { GetMitarbeiter } from "../../wailsjs/go/main/App";
import { main } from "../../wailsjs/go/models";

export default function Geburtstagsliste() {
  const [Mitarbeiter, setMitarbeiter] = useState<
    undefined | main.Geburtstagsliste
  >(undefined);

  useEffect(() => {
    (async () => {
      const res = await GetMitarbeiter();
      setMitarbeiter(res);
    })();
  }, []);

  return (
    <>
      <h2>Geburtstagsliste</h2>
      {Mitarbeiter?.Heute && Mitarbeiter.Heute.length > 0 && (
        <div className="panel">
          <h3>Heutige Geburtstage</h3>
          {Mitarbeiter.Heute.map((ma) => (
            <p key={ma.Name}>{ma.Name}</p>
          ))}
        </div>
      )}
      {Mitarbeiter?.Zukunft && Mitarbeiter.Zukunft.length > 0 && (
        <>
          <h3>Zukünftige Geburtstage</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
            }}
          >
            {Mitarbeiter.Zukunft.map((ma) => {
              const d = new Date(ma.Date);
              const day = d.toLocaleDateString("de-de", {
                day: "2-digit",
                month: "2-digit",
              });
              return (
                <div key={ma.Name} className="panel-without-p">
                  {ma.Name} - {day} -&gt; In {ma.Diff * -1} Tagen
                </div>
              );
            })}
          </div>
        </>
      )}
      {Mitarbeiter?.Vergangen && Mitarbeiter.Vergangen.length > 0 && (
        <>
          <h3>Vergangene Geburtstage</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
            }}
          >
            {Mitarbeiter.Vergangen.map((ma) => {
              const d = new Date(ma.Date);
              const day = d.toLocaleDateString("de-de", {
                day: "2-digit",
                month: "2-digit",
              });
              return (
                <div key={ma.Name} className="panel-without-p">
                  {ma.Name} - {day} -&gt; Vor {ma.Diff} Tagen
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
