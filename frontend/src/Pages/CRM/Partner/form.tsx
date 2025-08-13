import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAdmin from "@/hooks/useAdmin";
import {
  CreatePartner,
  DeletePartner,
  UpdatePartner,
} from "@/wailsjs/go/main/App";
import type { db, main } from "@/wailsjs/go/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";

const formSchema = z.object({
  Name: z.string(),
  Link: z.url(),
  Image: z.string(),
});

export default function PartnerForm({ Partner }: { Partner?: db.Partner }) {
  const admin = useAdmin();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: Partner?.Name ?? "",
      Link: Partner?.Link ?? "",
      Image: Partner?.Image ?? "",
    },
  });

  useEffect(() => {
    if (Partner == null) return;

    form.reset({
      Name: Partner.Name,
      Image: Partner.Image,
      Link: Partner.Link,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Partner]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const props: main.PartnerProps = {
      Name: values.Name,
      Link: values.Link,
      Image: values.Image,
    };
    if (Partner == null) {
      const res = await CreatePartner(props);
      if (res) {
        navigate("/CMS/Partner");
      } else {
        alert("Fehler beim anlegen von Abteilung");
      }
    } else {
      const res = await UpdatePartner(Partner.ID, props);
      if (res) {
        navigate("/CMS/Partner");
      } else {
        alert("Fehler beim aktualisieren von Abteilung");
      }
    }
  };

  const handleDelete = async () => {
    if (Partner == null) return;
    const res = await DeletePartner(Partner.ID);
    if (res) {
      navigate("/CMS/Partner");
    } else {
      alert("Fehler beim löschen des Partners");
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
                  <Input disabled={!admin} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bild</FormLabel>
                <FormControl>
                  <Input disabled={!admin} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input disabled={!admin} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button disabled={!admin} type="submit">
            Speichern
          </Button>
        </form>
      </Form>
      {Partner != null && (
        <Button
          disabled={!admin}
          variant={"destructive"}
          className="mt-5"
          onClick={handleDelete}
        >
          Partner löschen
        </Button>
      )}
    </div>
  );
}
