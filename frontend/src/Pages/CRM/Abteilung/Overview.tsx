import BackBtn from "@/components/BackBtn";
import { DataTable } from "@/components/DataTable";
import { AdminPage } from "@/components/SignedIn";
import { Button } from "@/components/ui/button";
import { GetAbteilungen } from "@/wailsjs/go/main/App";
import type { db } from "@/wailsjs/go/models";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const column: ColumnDef<db.Abteilung>[] = [
  {
    accessorKey: "ID",
    header: "Id",
  },
  {
    accessorKey: "Name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <Button asChild>
          <Link to={"/CMS/Abteilungen/" + x.ID}>Bearbeiten</Link>
        </Button>
      );
    },
  },
];

export default function AbteilungOverview() {
  const [Abteilungen, setAbteilungen] = useState<db.Abteilung[] | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const res = await GetAbteilungen();
      setAbteilungen(res);
    })();
  }, []);

  return (
    <AdminPage>
      <div className="panel">
        <div className="flex flex-row gap-8">
          <BackBtn href="/CMS" />

          <Button asChild className="mt-2">
            <Link to="/CMS/Abteilungen/Neu">Neu</Link>
          </Button>
        </div>
        <div className="panel-label">Abteilungen Übersicht</div>
        <div className="p-1 mt-2">
          <DataTable data={Abteilungen ?? []} columns={column} />
        </div>
      </div>
    </AdminPage>
  );
}
