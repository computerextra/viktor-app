import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GenerateAomei } from "@/wailsjs/go/main/App";
import type { main } from "@/wailsjs/go/models";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  Lizenz: z.string(),
  Gerätenummer: z.string(),
});

export function Aomei() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const props: main.AoemeiProps = {
      Gerätenummer: values.Gerätenummer,
      Lizenz: values.Lizenz,
    };
    const res = await GenerateAomei(props);
    if (res) {
      form.reset({
        Gerätenummer: "",
        Lizenz: "",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="Lizenz"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lizenznummer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Gerätenummer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gerätenummer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Drucken</Button>
      </form>
    </Form>
  );
}
