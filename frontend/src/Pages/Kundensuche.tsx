import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KundenSuche } from "@/wailsjs/go/main/App";
import type { main } from "@/wailsjs/go/models";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { HatGlasses, Truck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  Suche: z.string().min(3, {
    message: "Es müssen mindestens 3 Zeichen eingegeben werden",
  }),
});

export default function Kundensuche() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<undefined | main.KundenResponse[]>(
    undefined
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const props: main.SearchProps = {
      Search: values.Suche,
    };
    const res = await KundenSuche(props);
    setResults(res);
    setLoading(false);
  }

  const column: ColumnDef<main.KundenResponse>[] = [
    {
      accessorKey: "LiefNr",
      header: "Kunde/Lieferant",
      cell: ({ row }) => {
        const x = row.original;
        if (x.KundNr) {
          return <HatGlasses />;
        } else {
          return <Truck />;
        }
      },
    },
    {
      accessorKey: "KundNr",
      header: "Kundennummer",
      cell: ({ row }) => {
        const x = row.original;
        if (x.KundNr) {
          return x.KundNr;
        } else {
          return x.LiefNr;
        }
      },
    },
    {
      accessorKey: "Suchbegriff",
      header: "Name",
    },
    {
      accessorKey: "Telefon1",
      header: "Telefon",
      cell: ({ row }) => {
        const x = row.original;

        return (
          <div>
            {x.Telefon1 && (
              <a href={"tel:" + x.Telefon1} className="underline">
                {x.Telefon1}
              </a>
            )}
            <br />
            {x.Telefon2 && (
              <a href={"tel:" + x.Telefon2} className="underline">
                {x.Telefon2}
              </a>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "Mobiltelefon1",
      header: "Mobil",
      cell: ({ row }) => {
        const x = row.original;

        return (
          <div>
            {x.Mobiltelefon1 && (
              <a href={"tel:" + x.Mobiltelefon1} className="underline">
                {x.Mobiltelefon1}
              </a>
            )}
            <br />
            {x.Mobiltelefon2 && (
              <a href={"tel:" + x.Mobiltelefon2} className="underline">
                {x.Mobiltelefon2}
              </a>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "EMail1",
      header: "Email",
      cell: ({ row }) => {
        const x = row.original;

        return (
          <div>
            {x.EMail1 && (
              <a href={"mailto:" + x.EMail1} className="underline">
                {x.EMail1}
              </a>
            )}
            <br />
            {x.EMail2 && (
              <a href={"mailto:" + x.EMail2} className="underline">
                {x.EMail2}
              </a>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "KundUmsatz",
      header: "Umsatz in €",
      cell: ({ row }) => {
        const x = row.original;
        if (x.KundNr) {
          return x.KundUmsatz?.toFixed(2);
        } else {
          return x.LiefUmsatz?.toFixed(2);
        }
      },
    },
  ];

  return (
    <div className="panel">
      <div className="panel-label">Sage Kundensuche</div>
      <div className="mt-5 p-1 mb-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="Suche"
              render={({ field }) => (
                <FormItem>
                  <div className="flex w-full max-w-sm items-center gap-2 mx-auto">
                    <FormControl>
                      <Input
                        placeholder="Suche..."
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      variant={"outline"}
                      disabled={loading}
                    >
                      {loading ? "Sucht..." : "Suchen"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="max-w-[95%] mx-auto my-2">
        <DataTable columns={column} data={results ?? []} />
      </div>
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Keine Ergebnisse.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
