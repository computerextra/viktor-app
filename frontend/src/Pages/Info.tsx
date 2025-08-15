import { AdminPage } from "@/components/SignedIn";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SendInfoMail } from "@/wailsjs/go/main/App";
import type { main } from "@/wailsjs/go/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  mail: z.email(),
  auftrag: z.string(),
});

export default function Info() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setSent(false);
    setLoading(true);
    const props: main.InfoProps = {
      Auftrag: values.auftrag,
      Mail: values.mail,
    };
    const res = await SendInfoMail(props);
    if (res) {
      setSent(true);
      form.reset({
        auftrag: "",
        mail: "",
      });
    }
    setLoading(false);
  };

  return (
    <AdminPage>
      <div className="panel">
        <div className="panel-label">Info an Kunde</div>
        <div className="p-1 my-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex w-full max-w-2xl items-center gap-2">
                <FormField
                  control={form.control}
                  name="mail"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="mail"
                          placeholder="E-Mail"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="auftrag"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Auftrag inkl AU/LI/RE"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={loading} type="submit" variant={"outline"}>
                  Senden
                </Button>
              </div>
            </form>
          </Form>
          {sent && <p>Mail wurde erfolgreich gesendet.</p>}
        </div>
      </div>
    </AdminPage>
  );
}
