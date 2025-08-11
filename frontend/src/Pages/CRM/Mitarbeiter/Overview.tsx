import BackBtn from "@/components/BackBtn";
import { DataTable } from "@/components/DataTable";
import { GetMitarbeiterMitAbteilung } from "@/wailsjs/go/main/App";
import type { db } from "@/wailsjs/go/models";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

const columns: ColumnDef<db.GetMitarbeiterWithAbteilungRow>[] = [
  {
    accessorKey: "Name",
    header: "Name",
  },
  {
    accessorKey: "AbteilungName",
    header: "Abteilung",
  },
];

export default function MitarbeiterOverview() {
  const [Mitarbeiter, setMitarbeiter] = useState<
    db.GetMitarbeiterWithAbteilungRow[] | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const res = await GetMitarbeiterMitAbteilung();
      setMitarbeiter(res);
    })();
  }, []);

  return (
    <div className="panel">
      <BackBtn href="/CMS" />
      <div className="panel-label">Mitarbeiter Übersicht</div>
      <div className="p-1">
        <DataTable columns={columns} data={Mitarbeiter ?? []} />
      </div>
    </div>
  );
}
