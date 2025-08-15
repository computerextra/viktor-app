import { AdminPage } from "@/components/SignedIn";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AccordionItem } from "@radix-ui/react-accordion";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { MitarbeiterTable } from "./Mitarbeiter/mitarbeiter-table";

type porto = {
  Name: string;
  Gewicht: number;
  Kosten: number;
};

const DHL: porto[] = [
  {
    Name: "DHL",
    Gewicht: 1,
    Kosten: 5,
  },
  {
    Name: "DHL",
    Gewicht: 3,
    Kosten: 5.55,
  },
  {
    Name: "DHL",
    Gewicht: 5,
    Kosten: 6.6,
  },
  {
    Name: "DHL",
    Gewicht: 10,
    Kosten: 8.65,
  },
  {
    Name: "DHL",
    Gewicht: 20,
    Kosten: 13.55,
  },
  {
    Name: "DHL",
    Gewicht: 31.5,
    Kosten: 16.3,
  },
];

const DHL_Zusatz = {
  Maut: 0.19,
  Peak: 0.69,
  Peak_Seasson: ["November", "Dezember"],
  GoGreen: 0.12,
  Treibstoff: 19.5, // Prozent
  Min_Höhe: 1,
  Min_Breite: 11,
  Min_Länge: 15,
  Max_Höhe: 60,
  Max_Breite: 60,
  Max_Länge: 120,
};

const GLS: porto[] = [
  {
    Name: "GLS",
    Gewicht: 2,
    Kosten: 5.43,
  },
  {
    Name: "GLS",
    Gewicht: 3,
    Kosten: 5.7,
  },
  {
    Name: "GLS",
    Gewicht: 5,
    Kosten: 6.01,
  },
  {
    Name: "GLS",
    Gewicht: 8,
    Kosten: 6.96,
  },
  {
    Name: "GLS",
    Gewicht: 10,
    Kosten: 8.07,
  },
  {
    Name: "GLS",
    Gewicht: 15,
    Kosten: 9.62,
  },
  {
    Name: "GLS",
    Gewicht: 20,
    Kosten: 11.6,
  },
  {
    Name: "GLS",
    Gewicht: 25,
    Kosten: 15.41,
  },
  {
    Name: "GLS",
    Gewicht: 32,
    Kosten: 24.14,
  },
  {
    Name: "GLS",
    Gewicht: 40,
    Kosten: 29.66,
  },
];

const GLS_Zusatz = {
  Privat: 0.55,
  Wiegen: 0.3,
  Maut: 0.49,
  Treibstoff: 22, // Prozent
  Klima: 3.85, // Prozent
  Peak: 3.6, // Prozent
};

const Monate = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const columns: ColumnDef<porto>[] = [
  {
    accessorKey: "Name",
    header: "Anbieter",
  },
  {
    accessorKey: "Gewicht",
    header: "Gewicht",
  },
  {
    accessorKey: "Kosten",
    header: "Kosten",
  },
];

export default function Versand() {
  return (
    <AdminPage>
      <div className="panel">
        <div className="panel-label">Versandkosten Rechner</div>
        <div className="p-1 mt-4">
          <Kostentabelle />
          <Rechner />
        </div>
      </div>
    </AdminPage>
  );
}

function Kostentabelle() {
  return (
    <div className="panel">
      <div className="panel-label">Aktuelle Preise</div>
      <div className="p-1">
        <p className="text-center">
          Falls die Preise nicht mehr passen, dann bitte dem Kirchner bescheid
          geben!
        </p>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Kostentabelle</AccordionTrigger>
            <AccordionContent>
              <MitarbeiterTable columns={columns} data={[...DHL, ...GLS]} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function Rechner() {
  const [Höhe, setHöhe] = useState<string | undefined>(undefined);
  const [Länge, setLänge] = useState<string | undefined>(undefined);
  const [Breite, setBreite] = useState<string | undefined>(undefined);
  const [Gewicht, setGewicht] = useState<string | undefined>(undefined);
  const [Privatkunde, setPrivatkunde] = useState(false);
  const [Volumengewicht, setVolumengewicht] = useState<string | undefined>(
    undefined
  );
  const [Preis, setPreis] = useState<string | undefined>(undefined);
  const [Preis_DHL, setPreis_DHL] = useState<string | undefined>(undefined);
  const [Preis_GLS, setPreis_GLS] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (Höhe == null) return;
    if (Länge == null) return;
    if (Breite == null) return;
    if (Gewicht == null) return;

    const h = parseFloat(Höhe.replace(",", "."));
    const l = parseFloat(Länge.replace(",", "."));
    const b = parseFloat(Höhe.replace(",", "."));
    const g = parseFloat(Gewicht.replace(",", "."));

    const Volumengewicht = (l * b * h) / 6000;

    let dhl_versand = 0;
    let gls_versand = 0;
    const month = new Date().getMonth();

    for (const x of DHL) {
      if (g <= x.Gewicht) {
        dhl_versand = x.Kosten;
        break;
      }
    }

    const realW =
      g <= 30 && Volumengewicht <= 30 && Volumengewicht > g
        ? Volumengewicht
        : g;

    for (const x of GLS) {
      if (realW <= x.Gewicht) {
        gls_versand = x.Kosten;
        break;
      }
    }

    gls_versand =
      (GLS_Zusatz.Wiegen + GLS_Zusatz.Maut + gls_versand) *
      (GLS_Zusatz.Treibstoff / 100 + 1) *
      (GLS_Zusatz.Klima / 100 + 1) *
      (GLS_Zusatz.Peak / 100 + 1);

    dhl_versand =
      (DHL_Zusatz.Maut + DHL_Zusatz.GoGreen + dhl_versand) *
      (DHL_Zusatz.Treibstoff / 100 + 1);
    for (const x of DHL_Zusatz.Peak_Seasson) {
      if (Monate[month] == x) {
        dhl_versand += DHL_Zusatz.Peak;
      }
    }

    if (Privatkunde) gls_versand += GLS_Zusatz.Privat;

    if (g >= 31.5) dhl_versand = 0;

    if (g > 40) gls_versand = 0;

    let body = "",
      body_dhl = "",
      body_gls = "";

    if (l > DHL_Zusatz.Max_Länge) {
      dhl_versand = 0;
      body_dhl +=
        "Paket ist zu lang für einen Versand mit DHL. Maximallänge ist: " +
        DHL_Zusatz.Max_Länge +
        " cm; ";
    }
    if (l < DHL_Zusatz.Min_Länge) {
      dhl_versand = 0;
      body_dhl +=
        "Paket ist zu kurz für einen Versand mit DHL. Mindestlänge ist: " +
        DHL_Zusatz.Min_Länge +
        " cm; ";
    }
    if (b < DHL_Zusatz.Min_Breite) {
      dhl_versand = 0;
      body_dhl =
        "Paket ist nicht breit genug für einen Versand mit DHL. Mindestbreite ist: " +
        DHL_Zusatz.Min_Breite +
        " cm; ";
    }
    if (b > DHL_Zusatz.Max_Breite) {
      dhl_versand = 0;
      body_dhl =
        "Paket ist zu breit für einen Versand mit DHL. Maximalbreite ist: " +
        DHL_Zusatz.Max_Breite +
        " cm; ";
    }
    if (h < DHL_Zusatz.Min_Höhe) {
      dhl_versand = 0;
      body_dhl =
        "Paket ist nicht hoch genug für einen Versand mit DHL. Mindesthöhe ist: " +
        DHL_Zusatz.Min_Höhe +
        " cm; ";
    }
    if (h > DHL_Zusatz.Max_Höhe) {
      dhl_versand = 0;
      body_dhl =
        "Paket ist zu hoch für einen Versand mit DHL. Maximalhöhe ist: " +
        DHL_Zusatz.Max_Höhe +
        " cm; ";
    }

    if (dhl_versand == 0) body_dhl += "Passt nüscht. ";
    else body_dhl = "Versandkosten mit DHL: " + dhl_versand.toFixed(2) + "€";
    if (gls_versand == 0) body_gls += "Passt nüscht ";
    else {
      body_gls = "Versandkosten mit GLS: " + gls_versand.toFixed(2) + "€";
    }

    // DHL ist Günstiger
    if (dhl_versand < gls_versand && dhl_versand > 0)
      body = "DHL ist günstiger";
    // GLS ist Güsntiger
    if (gls_versand < dhl_versand && gls_versand > 0)
      body = "GLS ist günstiger";
    // Beide das selbe
    if (gls_versand == dhl_versand && dhl_versand > 0)
      body = "Egal, beide gleich teuer.";
    // Kein DHL aber GLS
    if (dhl_versand == 0 && gls_versand > 0)
      body = "Nimm GLS, mit DHL können wir das Ding nicht verschicken";
    // Kein GLS aber DHL
    if (gls_versand == 0 && dhl_versand > 0)
      body = "Nimm DHL, mit GLS können wir das Ding nicht verschicken";
    // Beides nicht
    if (gls_versand == 0 && dhl_versand == 0)
      body = "Zu groß / schwer; Das Ding bekommen wir nicht verschickt.";

    setPreis(body);
    setPreis_DHL(body_dhl);
    setPreis_GLS(body_gls);
    setVolumengewicht(Volumengewicht.toFixed(2));
  }, [Höhe, Länge, Breite, Gewicht, Privatkunde]);

  return (
    <div className="panel mt-4">
      <div className="panel-label">Rechner</div>
      <div className="p-1">
        <div className="grid grid-cols-4 gap-8 mt-1">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="länge">Länge</Label>
            <Input
              type="text"
              id="länge"
              defaultValue={Länge}
              onChange={(e) => setLänge(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="höhe">Höhe</Label>
            <Input
              type="text"
              id="höhe"
              defaultValue={Höhe}
              onChange={(e) => setHöhe(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="breite">Breite</Label>
            <Input
              type="text"
              id="breite"
              defaultValue={Breite}
              onChange={(e) => setBreite(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="gewicht">Gewicht</Label>
            <Input
              type="text"
              id="gewicht"
              defaultValue={Gewicht}
              onChange={(e) => setGewicht(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="privat"
              defaultChecked={Privatkunde}
              onCheckedChange={(e) => setPrivatkunde(e)}
            />
            <Label htmlFor="privat">Privatkunde</Label>
          </div>
        </div>
        <div className="my-8">
          {Volumengewicht != null && (
            <>
              <span>Berechnetes Volumengewicht: {Volumengewicht}kg</span>
              <br />
            </>
          )}
          {Preis_DHL != null && (
            <>
              <span>{Preis_DHL}</span>
              <br />
            </>
          )}
          {Preis_GLS != null && (
            <>
              <span>{Preis_GLS}</span>
              <br />
            </>
          )}
          {Preis != null && <span>{Preis}</span>}
        </div>
      </div>
    </div>
  );
}
