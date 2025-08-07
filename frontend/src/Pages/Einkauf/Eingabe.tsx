import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  DeleteEinkauf,
  GetEinkauf,
  SkipEinkauf,
  UpdateEinkauf,
  UploadImage,
} from "@/wailsjs/go/main/App";
import type { db, main } from "@/wailsjs/go/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";

const formSchema = z.object({
  Paypal: z.boolean().default(false).optional(),
  Abonniert: z.boolean().default(false).optional(),
  Geld: z.string().optional(),
  Pfand: z.string().optional(),
  Dinge: z.string(),
});

export default function Eingabe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [Einkauf, setEinkauf] = useState<undefined | db.GetEinkaufRow>(
    undefined
  );
  const [Bild1, setBild1] = useState<undefined | string>(undefined);
  const [Bild2, setBild2] = useState<undefined | string>(undefined);
  const [Bild3, setBild3] = useState<undefined | string>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    (async () => {
      if (id == null) return;
      const res = await GetEinkauf(id);
      setEinkauf(res);
    })();
  }, [id]);

  useEffect(() => {
    if (Einkauf == null) return;

    if (Einkauf.Bild1.Valid && Einkauf.Bild1.String.length > 0) {
      setBild1(Einkauf.Bild1.String);
    }
    if (Einkauf.Bild2.Valid && Einkauf.Bild2.String.length > 0) {
      setBild2(Einkauf.Bild2.String);
    }
    if (Einkauf.Bild3.Valid && Einkauf.Bild3.String.length > 0) {
      setBild3(Einkauf.Bild1.String);
    }

    form.reset({
      Paypal: Einkauf.Paypal.Valid ? Einkauf.Paypal.Bool : false,
      Abonniert: Einkauf.Abonniert.Valid ? Einkauf.Abonniert.Bool : false,
      Dinge: Einkauf.Dinge.Valid ? Einkauf.Dinge.String : "",
      Geld: Einkauf.Geld.Valid ? Einkauf.Geld.String : undefined,
      Pfand: Einkauf.Pfand.Valid ? Einkauf.Pfand.String : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Einkauf]);

  async function upload(nr: number) {
    if (id == null) return;
    const res = await UploadImage(id, nr);
    switch (nr) {
      case 1:
        setBild1(res);
        break;
      case 2:
        setBild2(res);
        break;
      case 3:
        setBild3(res);
        break;
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (id == null) return;

    const props: main.EinkaufUpdateProps = {
      Abonniert: values.Abonniert ?? false,
      Dinge: values.Dinge,
      MitarbeiterId: id,
      Paypal: values.Paypal ?? false,
      Bild1,
      Bild2,
      Bild3,
    };
    const res = await UpdateEinkauf(props);
    if (res) {
      navigate("/Einkauf");
    } else {
      alert("FEHLER BEIM SPEICHERN");
    }
  }

  async function skipEinkauf() {
    if (!Einkauf?.EinkaufID.Valid || Einkauf?.EinkaufID.String.length < 1)
      return;
    const res = await SkipEinkauf(Einkauf.EinkaufID.String);
    if (res) {
      navigate("/Einkauf");
    } else {
      alert("Fehler beim Überspringen des Einkaufs");
    }
  }

  async function deleteEinkauf() {
    if (!Einkauf?.EinkaufID.Valid || Einkauf?.EinkaufID.String.length < 1)
      return;
    const res = await DeleteEinkauf(Einkauf.EinkaufID.String);
    if (res) {
      navigate("/Einkauf");
    } else {
      alert("Fehler beim Löschen des Einkaufs");
    }
  }

  return (
    <div className="p-2">
      <div className="panel mt-3">
        <div className="panel-label">Einkauf Eingabe für {Einkauf?.Name}</div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-4 mb-4 p-2"
          >
            <div className="grid grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="Geld"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geld</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Pfand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pfand</FormLabel>
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
                name="Paypal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0 5">
                      <FormLabel>Paypal</FormLabel>
                      <FormDescription>
                        Hier aktivieren, wenn mit Paypal gezahlt werden soll
                      </FormDescription>
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
              <FormField
                control={form.control}
                name="Abonniert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0 5">
                      <FormLabel>Abbonieren</FormLabel>
                      <FormDescription>
                        Hier aktivieren, der Einkauf abboniert werden soll. (Der
                        Einkauf steht damit jeden Tag wieder in der Liste.)
                      </FormDescription>
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
            </div>
            <FormField
              control={form.control}
              name="Dinge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dinge</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {Einkauf && (
              <div className="grid grid-cols-3 gap-8">
                <div className="mx-auto">
                  {Bild1 ? (
                    <div>
                      <img src={Bild1} className="h-auto w-33 rounded-lg" />
                      <Button
                        role="button"
                        type="button"
                        className="mt-2"
                        onClick={() => setBild1(undefined)}
                      >
                        Bild löschen
                      </Button>
                    </div>
                  ) : (
                    <Button
                      role="button"
                      type="button"
                      onClick={() => upload(1)}
                    >
                      Neues Bild Hochladen
                    </Button>
                  )}
                </div>
                <div className="mx-auto">
                  {Bild2 ? (
                    <div>
                      <img src={Bild2} className="h-auto w-33 rounded-lg" />
                      <Button
                        role="button"
                        type="button"
                        className="mt-2"
                        onClick={() => setBild2(undefined)}
                      >
                        Bild löschen
                      </Button>
                    </div>
                  ) : (
                    <Button
                      role="button"
                      type="button"
                      onClick={() => upload(1)}
                    >
                      Neues Bild Hochladen
                    </Button>
                  )}
                </div>
                <div className="mx-auto">
                  {Bild3 ? (
                    <div>
                      <img src={Bild3} className="h-auto w-33 rounded-lg" />
                      <Button
                        role="button"
                        type="button"
                        className="mt-2"
                        onClick={() => setBild3(undefined)}
                      >
                        Bild löschen
                      </Button>
                    </div>
                  ) : (
                    <Button
                      role="button"
                      type="button"
                      onClick={() => upload(2)}
                    >
                      Neues Bild Hochladen
                    </Button>
                  )}
                </div>
              </div>
            )}
            <div className="grid">
              <Button type="submit">Speichern</Button>
            </div>
          </form>
        </Form>
      </div>
      {Einkauf && Einkauf.EinkaufID && (
        <div className="grid grid-cols-2 gap-8 mt-5">
          <Button variant={"destructive"} onClick={skipEinkauf}>
            Einkauf Überspringen
          </Button>
          <Button variant={"destructive"} onClick={deleteEinkauf}>
            Einkauf Löschen
          </Button>
        </div>
      )}
    </div>
  );
}
