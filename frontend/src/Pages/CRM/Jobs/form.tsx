import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CreateJob, DeleteJob, UpdateJob } from "@/wailsjs/go/main/App";
import type { db, main } from "@/wailsjs/go/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";

const formSchema = z.object({
  Name: z.string(),
  Online: z.boolean(),
});

export default function JobForm({ Job }: { Job?: db.Job }) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: Job?.Name ?? "",
      Online: Job?.Online ?? false,
    },
  });

  useEffect(() => {
    if (Job == null) return;

    form.reset({
      Name: Job.Name,
      Online: Job.Online,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Job]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const props: main.JobProps = {
      Name: values.Name,
      Online: values.Online,
    };
    if (Job == null) {
      const res = await CreateJob(props);
      if (res) {
        navigate("/CMS/Jobs");
      } else {
        alert("Fehler beim anlegen von Job");
      }
    } else {
      const res = await UpdateJob(Job.ID, props);
      if (res) {
        navigate("/CMS/Jobs");
      } else {
        alert("Fehler beim aktualisieren von Job");
      }
    }
  };

  const handleDelete = async () => {
    if (Job == null) return;
    const res = await DeleteJob(Job.ID);
    if (res) {
      navigate("/CMS/Jobs");
    } else {
      alert("Fehler beim löschen des Jobs");
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
          <FormField
            control={form.control}
            name="Online"
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
      {Job != null && (
        <Button variant={"destructive"} className="mt-5" onClick={handleDelete}>
          Job löschen
        </Button>
      )}
    </div>
  );
}
