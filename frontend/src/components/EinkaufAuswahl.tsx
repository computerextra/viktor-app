import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GetMitarbeiter } from "@/wailsjs/go/main/App";
import type { db } from "@/wailsjs/go/models";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function EinkaufAuswahl() {
  const [Mitarbeiter, setMitarbeiter] = useState<db.Mitarbeiter[] | undefined>(
    undefined
  );
  const [selected, setSelected] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const res = await GetMitarbeiter();
      setMitarbeiter(res);
    })();
  }, []);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Mitarbeiter auswahl</DialogTitle>
        <DialogDescription>
          <Select onValueChange={(e) => setSelected(e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Bitte wählen..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Mitarbeiter?.map((x) => (
                  <SelectItem value={x.ID}>{x.Name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4"></div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Abbrechen</Button>
        </DialogClose>
        <Button disabled={selected == undefined} asChild>
          <Link to={"/Einkauf/" + selected}>Eingeben</Link>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
