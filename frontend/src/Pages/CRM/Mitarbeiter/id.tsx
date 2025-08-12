import BackBtn from "@/components/BackBtn";
import { GetAbteilung } from "@/wailsjs/go/main/App";
import { db } from "@/wailsjs/go/models";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AbteilungForm from "./form";

// TODO: ALLES

export default function EditMitarbeiter() {
  const { id } = useParams();
  const [Abteilung, setAbteilung] = useState<db.Abteilung | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      if (id == null) return;
      const res = await GetAbteilung(id);
      setAbteilung(res);
    })();
  }, [id]);

  return (
    <div className="panel">
      <BackBtn href="/CMS/Abteilungen" />
      <div className="panel-label">{Abteilung?.Name} bearbeiten</div>
      <div className="p-2 mt-2">
        <AbteilungForm Abteilung={Abteilung} />
      </div>
    </div>
  );
}
