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
import {
  CreateMitarbeiter,
  DeleteMitabeiter,
  GetAbteilungen,
  UpdateMitarbeiter,
} from "@/wailsjs/go/main/App";
import type { db, main } from "@/wailsjs/go/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";

const formSchema = z.object({
  Azubi: z.boolean(),
  Image: z.boolean(),
  Name: z.string(),
  AbteilungId: z.string().optional(),
  Focus: z.string().optional(),
  Geburtstag: z.date().optional(),
  Gruppenwahl: z.string().optional(),
  Homeoffice: z.string().optional(),
  Mail: z.email().optional(),
  MobilBusiness: z.string().optional(),
  MobilPrivat: z.string().optional(),
  Sex: z.string().optional(),
  Short: z.string().optional(),
  TelefonIntern1: z.string().optional(),
  TelefonIntern2: z.string().optional(),
  TelefonPrivat: z.string().optional(),
});

export default function MitarbeiterForm({
  Mitarbeiter,
}: {
  Mitarbeiter?: db.Mitarbeiter;
}) {
  const navigate = useNavigate();
  const [Abteilungen, setAbteilungen] = useState<db.Abteilung[] | undefined>(
    undefined
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Azubi: Mitarbeiter?.Azubi ?? false,
      Image: Mitarbeiter?.Image ?? false,
      Name: Mitarbeiter?.Name,
      AbteilungId: Mitarbeiter?.Abteilungid.Valid
        ? Mitarbeiter.Abteilungid.String
        : undefined,
      Focus: Mitarbeiter?.Focus.Valid ? Mitarbeiter.Focus.String : undefined,
      Geburtstag: Mitarbeiter?.Geburtstag.Valid
        ? new Date(Mitarbeiter.Geburtstag.Time)
        : undefined,
      Gruppenwahl: Mitarbeiter?.Gruppenwahl.Valid
        ? Mitarbeiter.Gruppenwahl.String
        : undefined,
      Homeoffice: Mitarbeiter?.Homeoffice.Valid
        ? Mitarbeiter.Homeoffice.String
        : undefined,
      Mail: Mitarbeiter?.Mail.Valid ? Mitarbeiter.Mail.String : undefined,
      MobilBusiness: Mitarbeiter?.MobilBusiness.Valid
        ? Mitarbeiter.MobilBusiness.String
        : undefined,
      MobilPrivat: Mitarbeiter?.MobilPrivat.Valid
        ? Mitarbeiter.MobilPrivat.String
        : undefined,
      Sex: Mitarbeiter?.Sex.Valid ? Mitarbeiter.Sex.String : undefined,
      Short: Mitarbeiter?.Short.Valid ? Mitarbeiter.Short.String : undefined,
      TelefonIntern1: Mitarbeiter?.TelefonIntern1.Valid
        ? Mitarbeiter.TelefonIntern1.String
        : undefined,
      TelefonIntern2: Mitarbeiter?.TelefonIntern2.Valid
        ? Mitarbeiter.TelefonIntern2.String
        : undefined,
      TelefonPrivat: Mitarbeiter?.TelefonPrivat.Valid
        ? Mitarbeiter.TelefonPrivat.String
        : undefined,
    },
  });

  useEffect(() => {
    (async () => {
      const res = await GetAbteilungen();
      setAbteilungen(res);
    })();
  }, []);

  useEffect(() => {
    if (Mitarbeiter == null) return;

    form.reset({
      Azubi: Mitarbeiter?.Azubi ?? false,
      Image: Mitarbeiter?.Image ?? false,
      Name: Mitarbeiter?.Name,
      AbteilungId: Mitarbeiter?.Abteilungid.Valid
        ? Mitarbeiter.Abteilungid.String
        : undefined,
      Focus: Mitarbeiter?.Focus.Valid ? Mitarbeiter.Focus.String : undefined,
      Geburtstag: Mitarbeiter?.Geburtstag.Valid
        ? new Date(Mitarbeiter.Geburtstag.Time)
        : undefined,
      Gruppenwahl: Mitarbeiter?.Gruppenwahl.Valid
        ? Mitarbeiter.Gruppenwahl.String
        : undefined,
      Homeoffice: Mitarbeiter?.Homeoffice.Valid
        ? Mitarbeiter.Homeoffice.String
        : undefined,
      Mail: Mitarbeiter?.Mail.Valid ? Mitarbeiter.Mail.String : undefined,
      MobilBusiness: Mitarbeiter?.MobilBusiness.Valid
        ? Mitarbeiter.MobilBusiness.String
        : undefined,
      MobilPrivat: Mitarbeiter?.MobilPrivat.Valid
        ? Mitarbeiter.MobilPrivat.String
        : undefined,
      Sex: Mitarbeiter?.Sex.Valid ? Mitarbeiter.Sex.String : undefined,
      Short: Mitarbeiter?.Short.Valid ? Mitarbeiter.Short.String : undefined,
      TelefonIntern1: Mitarbeiter?.TelefonIntern1.Valid
        ? Mitarbeiter.TelefonIntern1.String
        : undefined,
      TelefonIntern2: Mitarbeiter?.TelefonIntern2.Valid
        ? Mitarbeiter.TelefonIntern2.String
        : undefined,
      TelefonPrivat: Mitarbeiter?.TelefonPrivat.Valid
        ? Mitarbeiter.TelefonPrivat.String
        : undefined,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Mitarbeiter]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let y: number, m: number, d: number;
    let bday: string = "";
    if (values.Geburtstag != null) {
      y = values.Geburtstag.getFullYear();
      m = values.Geburtstag.getMonth() + 1;
      d = values.Geburtstag.getDate();
      bday = `${y}-${m}-${d}`;
    }
    const props: main.MitarbeiterProps = {
      Azubi: values.Azubi,
      Image: values.Image,
      Name: values.Name,
      AbteilungId: values.AbteilungId,
      Focus: values.Focus,
      Geburtstag: values.Geburtstag != null ? bday : undefined,
      Gruppenwahl: values.Gruppenwahl,
      Homeoffice: values.Homeoffice,
      Mail: values.Mail,
      MobilBusiness: values.MobilBusiness,
      MobilPrivat: values.MobilPrivat,
      Sex: values.Sex,
      Short: values.Short,
      TelefonIntern1: values.TelefonIntern1,
      TelefonIntern2: values.TelefonIntern2,
      TelefonPrivat: values.TelefonPrivat,
    };
    if (Mitarbeiter == null) {
      const res = await CreateMitarbeiter(props);
      if (res) {
        navigate("/CMS/Mitarbeiter");
      } else {
        alert("Fehler beim anlegen von Mitarbeiter");
      }
    } else {
      const res = await UpdateMitarbeiter(Mitarbeiter.ID, props);
      if (res) {
        navigate("/CMS/Mitarbeiter");
      } else {
        alert("Fehler beim aktualisieren von Abteilung");
      }
    }
  };

  const handleDelete = async () => {
    if (Mitarbeiter == null) return;
    const res = await DeleteMitabeiter(Mitarbeiter.ID);
    if (res) {
      navigate("/CMS/Mitarbeiter");
    } else {
      alert("Fehler beim ölöschen des Mitarbeiters");
    }
  };

  return (
    <div className="w-[60%]">
      {Abteilungen != null && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="Short"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Mail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mail</FormLabel>
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
                name="Sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geschlecht</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Geschlecht wählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m">Männlich</SelectItem>
                        <SelectItem value="w">Weiblich</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="AbteilungId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abteilung</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Abteilung wählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Abteilungen?.map((x) => (
                          <SelectItem key={x.ID} value={x.ID}>
                            {x.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="Focus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Focus (Komma getrennt)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Speichern</Button>
          </form>
        </Form>
      )}
      {Mitarbeiter != null && (
        <Button variant={"destructive"} className="mt-5" onClick={handleDelete}>
          Mitarbeiter löschen
        </Button>
      )}
    </div>
  );
}
