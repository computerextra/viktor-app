import BackBtn from "@/components/BackBtn";
import { DataTable } from "@/components/DataTable";
import { SignedIn } from "@/components/SignedIn";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GetPartners } from "@/wailsjs/go/main/App";
import type { db } from "@/wailsjs/go/models";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Link } from "react-router";
const column: ColumnDef<db.Partner>[] = [
  {
    accessorKey: "ID",
    header: "Id",
  },
  {
    accessorKey: "Name",
    header: "Name",
  },
  {
    accessorKey: "Link",
    header: "Link",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <a target="_blank" href={x.Link} className="underline">
          {x.Link}
        </a>
      );
    },
  },
  {
    accessorKey: "Image",
    header: "Bild",
    cell: ({ row }) => {
      const x = row.original;

      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="max-w-[200px] overflow-hidden text-ellipsis">
              <p>{x.Image}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <img
              className="max-h-[100px] w-auto bg-white rounded-lg"
              src={"https://computer-extra.de/Images/Partner/" + x.Image}
            />
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <Button asChild>
          <Link to={"/CMS/Partner/" + x.ID}>Bearbeiten</Link>
        </Button>
      );
    },
  },
];

export default function PartnerOverview() {
  const [Partner, setPartner] = useState<db.Partner[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const res = await GetPartners();
      setPartner(res);
    })();
  }, []);

  return (
    <SignedIn>
      <div className="panel">
        <div className="flex flex-row gap-8">
          <BackBtn href="/CMS" />
          <Button asChild className="mt-2">
            <Link to="/CMS/Partner/Neu">Neu</Link>
          </Button>
        </div>
        <div className="panel-label">Partner Übersicht</div>
        <div className="p-1 mt-2">
          <DataTable data={Partner ?? []} columns={column} />
        </div>
      </div>
    </SignedIn>
  );
}
