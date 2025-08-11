import BackBtn from "@/components/BackBtn";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { GetJobs } from "@/wailsjs/go/main/App";
import type { db } from "@/wailsjs/go/models";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Cross } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const column: ColumnDef<db.Job>[] = [
  {
    accessorKey: "ID",
    header: "Id",
  },
  {
    accessorKey: "Name",
    header: "Name",
  },
  {
    accessorKey: "Online",
    header: "Online",
    cell: ({ row }) => {
      const x = row.original;
      if (x.Online) {
        return <Check />;
      } else {
        return <Cross className="rotate-45" />;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <Button asChild>
          <Link to={"/CMS/Jobs/" + x.ID}>Bearbeiten</Link>
        </Button>
      );
    },
  },
];

export default function JobOverview() {
  const [Jobs, setJobs] = useState<db.Job[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const res = await GetJobs();
      setJobs(res);
    })();
  }, []);

  return (
    <div className="panel">
      <BackBtn href="/CMS" />
      <div className="panel-label">Job Übersicht</div>
      <div className="p-1 mt-2">
        <DataTable data={Jobs ?? []} columns={column} />
      </div>
    </div>
  );
}
