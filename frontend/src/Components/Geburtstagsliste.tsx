import { GetGeburtstagsliste } from "@/wailsjs/go/main/App";
import type { main } from "@/wailsjs/go/models";
import { useEffect, useState } from "react";

export default function Geburtstagsliste() {
  const [Mitarbeiter, setMitarbeiter] = useState<
    undefined | main.Geburtstagsliste
  >(undefined);

  useEffect(() => {
    (async () => {
      const res = await GetGeburtstagsliste();
      setMitarbeiter(res);
    })();
  }, []);

  return (
    <>
      <h2>Geburtstagsliste</h2>
      {Mitarbeiter?.Heute && Mitarbeiter.Heute.length > 0 && (
        <div className="panel mt-5">
          <div className="panel-label">Heutige Geburtstage</div>
          <div className="p-2">
            {Mitarbeiter.Heute.map((ma) => (
              <h1 key={ma.Name}>{ma.Name}</h1>
            ))}
          </div>
        </div>
      )}
      {Mitarbeiter?.Zukunft && Mitarbeiter.Zukunft.length > 0 && (
        <div className="panel mt-4">
          <div className="panel-label">Zukünftige Geburtstage</div>
          <div className="p-2">
            <table>
              <thead>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {Mitarbeiter.Zukunft.map((ma) => {
                  const d = new Date(ma.Date);
                  const day = d.toLocaleDateString("de-de", {
                    day: "2-digit",
                    month: "2-digit",
                  });
                  return (
                    <tr key={ma.Name}>
                      <td className="pe-10">{ma.Name}</td>
                      <td className="pe-10">{day}</td>
                      <td>In {ma.Diff * -1} Tagen</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {Mitarbeiter?.Vergangen && Mitarbeiter.Vergangen.length > 0 && (
        <div className="panel mt-4">
          <div className="panel-label">Vergangene Geburtstage</div>
          <div className="p-2">
            <table>
              <thead>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {Mitarbeiter.Vergangen.map((ma) => {
                  const d = new Date(ma.Date);
                  const day = d.toLocaleDateString("de-de", {
                    day: "2-digit",
                    month: "2-digit",
                  });
                  return (
                    <tr key={ma.Name}>
                      <td className="pe-10">{ma.Name}</td>
                      <td className="pe-10">{day}</td>
                      <td>Vor {ma.Diff} Tagen</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
