import BackBtn from "@/components/BackBtn";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { GetAngebote, ToggleAngebot } from "@/wailsjs/go/main/App";
import type { db } from "@/wailsjs/go/models";
import { WindowReload } from "@/wailsjs/runtime/runtime";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Cross, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
//   TODO: Auth einbauen
const handleToggle = async (id: string) => {
  const res = await ToggleAngebot(id);
  if (res) {
    WindowReload();
  } else {
    alert("Angebot konnte nicht angepasst werden");
  }
};

const columns: ColumnDef<db.Angebot>[] = [
  {
    accessorKey: "Title",
    header: "Titel",
  },
  {
    accessorKey: "Subtitle",
    header: "Sub Titel",
    cell: ({ row }) => {
      const x = row.original;
      if (x.Subtitle.Valid) {
        return x.Subtitle.String;
      } else {
        return "-";
      }
    },
  },
  {
    accessorKey: "Link",
    header: "Link",
    cell: ({ row }) => {
      const x = row.original;

      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="max-w-[200px] overflow-hidden text-ellipsis">
              <a href={x.Link} target="_blank" className="underline">
                {x.Link}
              </a>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="p-0.5 bg-black rounded-lg">{x.Link}</p>
          </TooltipContent>
        </Tooltip>
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
              src={"https://computer-extra.de/Images/Angebote/" + x.Image}
            />
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "DateStart",
    header: "Laufzeit",
    cell: ({ row }) => {
      const opts = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      } satisfies Intl.DateTimeFormatOptions;
      const x = row.original;
      const start = new Date(x.DateStart).toLocaleDateString("de-de", opts);
      const end = new Date(x.DateStop).toLocaleDateString("de-de", opts);
      return (
        <p>
          {start} - {end}
        </p>
      );
    },
  },
  {
    accessorKey: "Anzeigen",
    header: "Online",
    cell: ({ row }) => {
      const x = row.original;
      if (x.Anzeigen) {
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to={"/CMS/Angebote/" + x.ID}>Bearbeiten</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={async () => await handleToggle(x.ID)}>
              Toggle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function AngeboteOverview() {
  const [Angebote, setAngebote] = useState<db.Angebot[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const res = await GetAngebote();
      setAngebote(res);
    })();
  }, []);

  return (
    <div className="panel">
      <div className="flex flex-row gap-8">
        <BackBtn href="/CMS" />
        {/* TODO: Auth einbauen! */}
        <Button asChild className="mt-2">
          <Link to="/CMS/Angebote/Neu">Neu</Link>
        </Button>
      </div>
      <div className="panel-label">Angebote Üversicht</div>
      <div className="p-1 mt-2">
        <DataTable columns={columns} data={Angebote ?? []} />
      </div>
    </div>
  );
}
