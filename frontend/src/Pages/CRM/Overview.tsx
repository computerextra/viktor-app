import { Button } from "@/components/ui/button";
import { GetCmsCount } from "@/wailsjs/go/main/App";
import type { db } from "@/wailsjs/go/models";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function CmsOverview() {
  const [zahlen, setZahlen] = useState<db.GetCountRow | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const res = await GetCmsCount();
      setZahlen(res);
    })();
  }, []);

  return (
    <div className="panel">
      <div className="panel-label">CMS Übersicht</div>
      <div className="grid grid-cols-3 gap-8 my-5 p-1">
        <Button variant={"default"} asChild>
          <Link to={"/CMS/Abteilungen"}>Abteilungen {zahlen?.Abteilungen}</Link>
        </Button>
        <Button variant={"default"} asChild>
          <Link to={"/CMS/Angebote"}>Angebote {zahlen?.Angebote}</Link>
        </Button>
        <Button variant={"default"} asChild>
          <Link to={"/CMS/Mitarbeiter"}>Mitarbeiter {zahlen?.Mitarbeiter}</Link>
        </Button>
        <Button variant={"default"} asChild>
          <Link to={"/CMS/Jobs"}>Jobs {zahlen?.Jobs}</Link>
        </Button>
        <Button variant={"default"} asChild>
          <Link to={"/CMS/Parnter"}>Partner {zahlen?.Partner}</Link>
        </Button>
      </div>
    </div>
  );
}
