import BackBtn from "@/components/BackBtn";
import { Button } from "@/components/ui/button";
import { GetMitarbeiter } from "@/wailsjs/go/main/App";
import type { db } from "@/wailsjs/go/models";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { MitarbeiterTable } from "./mitarbeiter-table";

const columns: ColumnDef<db.Mitarbeiter>[] = [
  {
    accessorKey: "Name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "Mail",
    header: "E-Mail",
    cell: ({ row }) => {
      const x = row.original;
      return x.Mail.Valid ? (
        <a className="underline" href={"mailto:" + x.Mail.String}>
          {x.Mail.String}
        </a>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "Gruppenwahl",
    header: "Durchwahl",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <>
          <p>
            Gruppe: {x.Gruppenwahl.Valid ? x.Gruppenwahl.String : "-"} <br />
            DW 1: {x.TelefonIntern1.Valid ? x.TelefonIntern1.String : "-"}{" "}
            <br />
            DW 2: {x.TelefonIntern2.Valid ? x.TelefonIntern2.String : "-"}{" "}
            <br />
          </p>
        </>
      );
    },
  },
  {
    accessorKey: "TelefonPrivat",
    header: "Festnetz",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <p>
          Privat:{" "}
          {x.TelefonPrivat.Valid ? (
            <a href={"tel:" + x.TelefonPrivat.String} className="underline">
              {x.TelefonPrivat.String}
            </a>
          ) : (
            "-"
          )}{" "}
          <br />
          Geschäftlich:{" "}
          {x.TelefonBusiness.Valid ? (
            <a href={"tel:" + x.TelefonBusiness.String} className="underline">
              {x.TelefonBusiness.String}
            </a>
          ) : (
            "-"
          )}
        </p>
      );
    },
  },
  {
    accessorKey: "MobilPrivat",
    header: "Mobil",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <p>
          Privat:{" "}
          {x.MobilPrivat.Valid ? (
            <a href={"tel:" + x.MobilPrivat.String} className="underline">
              {x.MobilPrivat.String}
            </a>
          ) : (
            "-"
          )}{" "}
          <br />
          Geschäftlich:{" "}
          {x.MobilBusiness.Valid ? (
            <a href={"tel:" + x.MobilBusiness.String} className="underline">
              {x.MobilBusiness.String}
            </a>
          ) : (
            "-"
          )}
        </p>
      );
    },
  },
];

export default function MitarbeiterOverview() {
  const [Mitarbeiter, setMitarbeiter] = useState<db.Mitarbeiter[] | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const res = await GetMitarbeiter();
      setMitarbeiter(res);
    })();
  }, []);

  return (
    <div className="panel">
      <BackBtn href="/" />
      <div className="panel-label">Mitarbeiter Übersicht</div>
      <div className="p-1 my-2">
        <MitarbeiterTable columns={columns} data={Mitarbeiter ?? []} />
      </div>
    </div>
  );
}
