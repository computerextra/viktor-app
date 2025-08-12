import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  CreateAngebot,
  DeleteAngebot,
  UpdateAngebot,
} from "@/wailsjs/go/main/App";
import type { db, main } from "@/wailsjs/go/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";

const formSchema = z.object({
  Title: z.string(),
  Subtitle: z.string().optional(),
  Start: z.date(),
  Stop: z.date(),
  Link: z.url(),
  Image: z.string(),
  Anzeigen: z.boolean(),
});

export default function AngebotForm({ Angebot }: { Angebot?: db.Angebot }) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Title: Angebot?.Title ?? "",
      Anzeigen: Angebot?.Anzeigen ?? false,
      Image: Angebot?.Image ?? "",
      Link: Angebot?.Link ?? "",
      Start: Angebot?.DateStart ? new Date(Angebot.DateStart) : undefined,
      Stop: Angebot?.DateStop ? new Date(Angebot.DateStop) : undefined,
      Subtitle: Angebot?.Subtitle.Valid ? Angebot.Subtitle.String : undefined,
    },
  });

  useEffect(() => {
    if (Angebot == null) return;

    form.reset({
      Title: Angebot.Title,
      Anzeigen: Angebot.Anzeigen,
      Image: Angebot.Image,
      Link: Angebot.Link,
      Start: new Date(Angebot.DateStart),
      Stop: new Date(Angebot.DateStop),
      Subtitle: Angebot.Subtitle.Valid ? Angebot.Subtitle.String : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Angebot]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let y: string,
      m: number,
      d: string = "";

    y = values.Start.getFullYear().toString();
    m = values.Start.getMonth() + 1;
    d = values.Start.getDate().toString();
    const start = `${y}-${m}-${d}`;

    y = values.Stop.getFullYear().toString();
    m = values.Stop.getMonth() + 1;
    d = values.Stop.getDate().toString();
    const end = `${y}-${m}-${d}`;

    const props: main.AngebotProps = {
      Anzeigen: values.Anzeigen,
      DateStart: start,
      DateStop: end,
      Image: values.Image,
      Link: values.Link,
      Title: values.Title,
      Subtitle: values.Subtitle,
    };
    if (Angebot == null) {
      const res = await CreateAngebot(props);
      if (res) {
        navigate("/CMS/Angebote");
      } else {
        alert("Fehler beim anlegen von Abteilung");
      }
    } else {
      const res = await UpdateAngebot(Angebot.ID, props);
      if (res) {
        navigate("/CMS/Angebote");
      } else {
        alert("Fehler beim aktualisieren von Abteilung");
      }
    }
  };

  const handleDelete = async () => {
    if (Angebot == null) return;
    const res = await DeleteAngebot(Angebot.ID);
    if (res) {
      navigate("/CMS/Angebote");
    } else {
      alert("Fehler beim löschen der Abteilung");
    }
  };

  return (
    <div className="w-[60%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="Title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="Link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gaü-8">
            <FormField
              control={form.control}
              name="Start"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start</FormLabel>
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
                            format(field.value, "PPP")
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
                        locale={de}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Stop"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ende</FormLabel>
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
                            format(field.value, "PPP")
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
                        locale={de}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="Anzeigen"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Online</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Speichern</Button>
        </form>
      </Form>
      {Angebot != null && (
        <Button variant={"destructive"} className="mt-5" onClick={handleDelete}>
          Angebot löschen
        </Button>
      )}
    </div>
  );
}
