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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GetPdf, SearchArchive } from "@/wailsjs/go/main/App";
import type { db } from "@/wailsjs/go/models";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  Suche: z.string().min(3, {
    message: "Es müssen mindestens 3 Zeichen eingegeben werden",
  }),
});

export default function Archiv() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<undefined | db.SearchArchiveRow[]>(
    undefined
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await SearchArchive(values.Suche);
    setResults(res);
    setLoading(false);
  }

  async function Download(id: number) {
    setLoading(true);
    const res = await GetPdf(id);
    if (!res) {
      alert("Fehler beim Download der Datei");
    }
    setLoading(false);
  }

  const column: ColumnDef<db.SearchArchiveRow>[] = [
    {
      accessorKey: "Title",
      header: "Titel",
      cell: ({ row }) => {
        const x = row.original;
        return (
          <div className="max-w-xl overflow-hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-elipsis">{x.Title}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{x.Title}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const x = row.original;
        return <Button onClick={() => Download(x!.ID)}>Download</Button>;
      },
    },
  ];

  return (
    <div className="panel">
      <div className="panel-label">CE Archiv</div>
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
      <div className="max-w-4xl mx-auto my-2">
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
