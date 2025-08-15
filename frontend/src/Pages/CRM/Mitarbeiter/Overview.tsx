import BackBtn from "@/components/BackBtn";
import { DataTable } from "@/components/DataTable";
import { AdminPage } from "@/components/SignedIn";
import { Button } from "@/components/ui/button";
import { GetMitarbeiterMitAbteilung } from "@/wailsjs/go/main/App";
import type { db } from "@/wailsjs/go/models";
import type { ColumnDef } from "@tanstack/react-table";
import { Mars, Venus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
const columns: ColumnDef<db.GetMitarbeiterWithAbteilungRow>[] = [
  {
    accessorKey: "Name",
    header: "Name",
  },
  {
    accessorKey: "AbteilungName",
    header: "Abteilung",
    cell: ({ row }) => {
      const x = row.original;
      if (x.AbteilungName.Valid) {
        return x.AbteilungName.String;
      } else {
        return "-";
      }
    },
  },
  {
    accessorKey: "Sex",
    header: "Geschlecht",
    cell: ({ row }) => {
      const x = row.original;
      if (x.Sex.Valid) {
        if (x.Sex.String == "m") {
          return <Mars />;
        } else {
          return <Venus />;
        }
      } else {
        return "-";
      }
    },
  },
  {
    accessorKey: "Mail",
    header: "E-Mail",
    cell: ({ row }) => {
      const x = row.original;
      if (x.Mail.Valid) {
        return x.Mail.String;
      } else {
        return "-";
      }
    },
  },
  {
    accessorKey: "Focus",
    header: "Focus",
    cell: ({ row }) => {
      const x = row.original;
      if (x.Focus.Valid && x.Focus.String.length > 0) {
        return x.Focus.String;
      } else {
        return "-";
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <Button asChild>
          <Link to={"/CMS/Mitarbeiter/" + x.ID}>Bearbeiten</Link>
        </Button>
      );
    },
  },
];

export function MitarbeiterOverview() {
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
    <AdminPage>
      <div className="panel">
        <div className="flex flex-row gap-8">
          <BackBtn href="/CMS" />
          <Button asChild className="mt-2">
            <Link to="/CMS/Mitarbeiter/Neu">Neu</Link>
          </Button>
        </div>
        <div className="panel-label">Mitarbeiter Übersicht</div>
        <div className="p-1">
          <DataTable columns={columns} data={Mitarbeiter ?? []} />
        </div>
      </div>
    </AdminPage>
  );
}
