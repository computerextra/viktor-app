import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Aomei } from "./forms/aomei";
import Apple from "./forms/apple";
import Gdata from "./forms/gdata";
import Google from "./forms/google";
import Microsoft from "./forms/microsoft";
import Telekom from "./forms/telekom";

const Anbieter = ["AOMEI", "Apple", "G Data", "Google", "Microsoft", "Telekom"];

export default function Auswahl() {
  const [selected, setSelected] = useState<string | undefined>(undefined);

  return (
    <div className="panel print:hidden">
      <div className="panel-label">Formulare</div>
      <div className="p-1 ps-5 mt-2">
        <div className="mb-2">
          <Select onValueChange={(e) => setSelected(e)}>
            <SelectTrigger>
              <SelectValue placeholder="Anbieter wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Anbieter</SelectLabel>
                {Anbieter.sort().map((x) => (
                  <SelectItem key={x} value={x}>
                    {x}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="my-4 max-w-[30%]">
          <FormularForms selected={selected} />
        </div>
      </div>
    </div>
  );
}

function FormularForms({ selected }: { selected?: string }) {
  switch (selected) {
    case "AOMEI":
      return <Aomei />;
    case "Apple":
      return <Apple />;
    case "G Data":
      return <Gdata />;
    case "Google":
      return <Google />;
    case "Microsoft":
      return <Microsoft />;
    case "Telekom":
      return <Telekom />;
  }
}
