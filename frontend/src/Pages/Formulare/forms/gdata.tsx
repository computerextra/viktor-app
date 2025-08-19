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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenerateGdata } from "@/wailsjs/go/main/App";
import type { main } from "@/wailsjs/go/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const Versions = [
  "Anti-Virus",
  "MES",
  "Internet Security",
  "Internet Security Attached",
  "Mobile Internet Security",
  "Mobile Security",
  "Total Security",
];

const formSchema = z.object({
  Benutzername: z.string(),
  Passwort: z.string(),
  Benutzer: z.number().min(1),
  Version: z.string(),
  Lizenz: z.string(),
});

export default function Gdata() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const props: main.GDataProps = {
      Anwendung: values.Version,
      Benutzer: values.Benutzer,
      Benutzername: values.Benutzername,
      Lizenz: values.Lizenz,
      Passwort: values.Passwort,
    };

    const res = await GenerateGdata(props);
    if (res) {
      form.reset({
        Benutzer: 0,
        Benutzername: "",
        Lizenz: "",
        Passwort: "",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="Benutzername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benutzername</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Passwort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passwort</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Benutzer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anzahl der Benutzer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Benutzer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anzahl der Benutzer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lizenzmodell</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Lizenzmodell auswählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Versions.map((x, idx) => (
                    <SelectItem key={idx} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Lizenz"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lizenzschlüssel</FormLabel>
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
