import { EinkaufAuswahl } from "@/components/EinkaufAuswahl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { GetEinkaufsliste } from "@/wailsjs/go/main/App";
import type { db } from "@/wailsjs/go/models";

import { Check, Cross } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

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
      <div className="print:hidden">
        <div className="p-2">
          <h3>Einkaufsliste</h3>
          <div className="panel mt-3">
            <div className="panel-label">Knöppe</div>
            <div className="p-1 mt-2 grid grid-cols-3 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"default"}>Eingabe</Button>
                </DialogTrigger>
                <EinkaufAuswahl />
              </Dialog>
              <Button variant="default" asChild>
                <a
                  href="https://www.edeka.de/markt-id/10001842/prospekt/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Edeka Blättchen
                </a>
              </Button>
              <Button variant="default" onClick={window.print}>
                Drucken
              </Button>
            </div>
          </div>
          {Liste?.map((entry) => (
            <div className="panel my-3" key={entry.ID}>
              <div className="panel-label">
                <Link to={"/Einkauf/" + entry.ID}>{entry.Name}</Link>
              </div>
              <div className="p-1">
                <div className=" mt-3 grid grid-cols-2 gap-4">
                  <div className="panel">
                    <div className="panel-label">Geld / Pfand</div>
                    <div className="grid grid-cols-2 gap-4 ps-1 pt-1">
                      <span>
                        Geld: {entry.Geld.Valid ? entry.Geld.String : "-"}
                      </span>
                      <span>
                        Pfand: {entry.Pfand.Valid ? entry.Pfand.String : "-"}
                      </span>
                    </div>
                  </div>
                  <div className="panel">
                    <div className="panel-label">Paypal / Abo</div>
                    <div className="grid grid-cols-2 gap-4 ps-1 pt-1">
                      <span className="flex align-baseline">
                        Paypal:{" "}
                        {entry.Paypal.Bool ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Cross className="rotate-45 h-5 w-5" />
                        )}
                      </span>
                      <span className="flex align-baseline">
                        Abo:{" "}
                        {entry.Abonniert.Bool ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Cross className="rotate-45 h-5 w-5" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="panel mt-3">
                  <div className="panel-label">Dinge</div>
                  <pre className="p-1">{entry.Dinge.String.trim()}</pre>
                </div>
                {((entry.Bild1.Valid && entry.Bild1.String.length > 0) ||
                  (entry.Bild2.Valid && entry.Bild2.String.length > 0) ||
                  (entry.Bild3.Valid && entry.Bild3.String.length > 0)) && (
                  <div className="panel mt-3">
                    <div className="panel-label">Bilder</div>
                    <div className="grid grid-cols-3 gap-4">
                      {entry.Bild1.Valid && (
                        <img
                          className="w-35 h-auto object-contain"
                          src={entry.Bild1.String}
                        />
                      )}
                      {entry.Bild2.Valid && (
                        <img
                          className="w-35 h-auto object-contain"
                          src={entry.Bild2.String}
                        />
                      )}
                      {entry.Bild3.Valid && (
                        <img
                          className="w-35 h-auto object-contain"
                          src={entry.Bild3.String}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* druckansicht */}
      <div className="hidden print:block">
        <h1>An Post / Kaffee / Milch denken!</h1>
        {Liste?.map((x) => (
          <div key={x.ID}>
            <p className="!leading-normal">
              Name: {x.Name} <br />
              Geld: {x.Geld.String} <br />
              Pfand: {x.Pfand.String} <br />
              <span className="flex align-baseline">
                Paypal:{" "}
                {x.Paypal.Bool ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Cross className="rotate-45 h-5 w-5" />
                )}
              </span>
            </p>
            <pre className="font-sans">{x.Dinge.String.trim()}</pre>
            {((x.Bild1.Valid && x.Bild1.String.length > 0) ||
              (x.Bild2.Valid && x.Bild2.String.length > 0) ||
              (x.Bild3.Valid && x.Bild3.String.length > 0)) && (
              <div className="grid grid-cols-3 gap-4">
                {x.Bild1.Valid && (
                  <img className="w-40 h-auto" src={x.Bild1.String} />
                )}
                {x.Bild2.Valid && (
                  <img className="w-40 h-auto" src={x.Bild2.String} />
                )}
                {x.Bild3.Valid && (
                  <img className="w-40 h-auto" src={x.Bild3.String} />
                )}
              </div>
            )}
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}
