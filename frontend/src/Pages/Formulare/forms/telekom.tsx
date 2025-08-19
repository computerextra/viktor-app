import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { GenerateTelekom } from "@/wailsjs/go/main/App";
import type { main } from "@/wailsjs/go/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const Fragen = [
  "Wie lautet der Beruf Ihres Großvaters?",
  "Wo haben Sie Ihren Partner kennengelernt?",
  "Wie lautet der Name Ihrer Grundschule?",
  "Wie lautet Ihre Lieblingsfigur aus der Geschichte?",
  "Wie lautet der Name Ihrer Grundschule?",
  "Was ist Ihr Lieblingshobby?",
  "Wie lautet der Geburtsname Ihrer Mutter?",
  "Welche ist Ihre Lieblingsmannschaft?",
  "Was war Ihr erstes Auto?",
  "Wie hieß der beste Freund aus Ihrer Kindheit?",
  "Wie heißt oder hieß Ihr erstes Haustier?",
  "Wie ist der Name Ihres Lieblingslehrers?",
  "Wie hieß der Titel Ihres ersten Musik-Albums?",
  "Was war Ihr erstes Faschingskostüm?",
  "Wie hieß Ihr erstes Buch?",
  "Wie hieß Ihr erstes Plüschtier?",
  "Wo waren Sie bei Ihrem ersten Kuss?",
  "Was war Ihr schönstes Weihnachtsgeschenk?",
  "Wie heißt die Antwort auf die Frage aller Fragen?",
];

const formSchema = z.object({
  Kundennummer: z.string(),
  Benutzername: z.string(),
  Passwort: z.string(),
  Mobil: z.string(),
  Geburtstag: z.date(),
  Sicherheitsfrage: z.string(),
  Antwort: z.string(),
});

export default function Telekom() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const props: main.TelekomProps = {
      Antwort: values.Antwort,
      Benutzername: values.Benutzername,
      Geburtstag: values.Geburtstag.toLocaleDateString("de-de", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      Kundennummer: values.Kundennummer,
      Mobil: values.Mobil,
      Passwort: values.Passwort,
      Sicherheitsfrage: values.Sicherheitsfrage,
    };

    const res = await GenerateTelekom(props);

    if (res) {
      form.reset({
        Kundennummer: "",
        Benutzername: "",
        Passwort: "",
        Mobil: "",
        Geburtstag: undefined,
        Sicherheitsfrage: "",
        Antwort: "",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="Kundennummer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kundennummer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="Mobil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobil</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Geburtstag"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Geburtstag</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", {
                          locale: de,
                        })
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Sicherheitsfrage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sicherheitsfrage</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sicherheitsfrage wählen..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Fragen.map((x, idx) => (
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
          name="Antwort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Antwort</FormLabel>
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
