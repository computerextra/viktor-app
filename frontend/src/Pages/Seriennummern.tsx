import { AdminPage } from "@/components/SignedIn";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SucheSeriennummer } from "@/wailsjs/go/main/App";
import { ClipboardSetText } from "@/wailsjs/runtime/runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  search: z
    .string()
    .min(3, { message: "Es müssen mehr als 3 Zeichen eingegeben werden" })
    .max(11, {
      message: "Keine unserer Artikelnummern ist länger als 11 Zeichen",
    }),
});

export default function Seriennummern() {
  const [loading, setLoading] = useState(false);
  const [serial, setSerial] = useState<undefined | string>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const res = await SucheSeriennummer(values.search);
    const t = values.search + ": " + res;
    setSerial(t);

    form.reset({
      search: "",
    });
    await ClipboardSetText(t);
    setLoading(false);
  };

  return (
    <AdminPage>
      <div className="panel">
        <div className="panel-label">Seriennummern CE-SN</div>
        <div className="p-1 mt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <div className="mt-2 flex w-full max-w-sm items-center gap-2">
                      <FormControl>
                        <Input
                          type="text"
                          disabled={loading}
                          placeholder="Artikelnummer"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        variant="outline"
                        disabled={loading}
                      >
                        {loading ? "Sucht..." : "Suche"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          {serial && serial.length > 0 && (
            <div className="my-2 text-center">{serial}</div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
