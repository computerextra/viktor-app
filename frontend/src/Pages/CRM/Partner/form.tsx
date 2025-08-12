import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CreateAbteilung,
  DeleteAbteilung,
  UpdateAbteilung,
} from "@/wailsjs/go/main/App";
import type { db, main } from "@/wailsjs/go/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";

// TODO: ALLES

const formSchema = z.object({
  Name: z.string(),
});

export default function AbteilungForm({
  Abteilung,
}: {
  Abteilung?: db.Abteilung;
}) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: Abteilung?.Name ?? "",
    },
  });

  useEffect(() => {
    if (Abteilung == null) return;

    form.reset({
      Name: Abteilung.Name,
    });
  }, [Abteilung]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const props: main.AbteilungProps = {
      Name: values.Name,
    };
    if (Abteilung == null) {
      const res = await CreateAbteilung(props);
      if (res) {
        navigate("/CMS/Abteilungen");
      } else {
        alert("Fehler beim anlegen von Abteilung");
      }
    } else {
      const res = await UpdateAbteilung(Abteilung.ID, props);
      if (res) {
        navigate("/CMS/Abteilungen");
      } else {
        alert("Fehler beim aktualisieren von Abteilung");
      }
    }
  };

  const handleDelete = async () => {
    if (Abteilung == null) return;
    const res = await DeleteAbteilung(Abteilung.ID);
    if (res) {
      navigate("/CMS/Abteilungen");
    } else {
      alert("Fehler beim ölöschen der Abteilung");
    }
  };

  return (
    <div className="w-[60%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Speichern</Button>
        </form>
      </Form>
      {Abteilung != null && (
        <Button variant={"destructive"} className="mt-5" onClick={handleDelete}>
          Abteilung löschen
        </Button>
      )}
    </div>
  );
}
