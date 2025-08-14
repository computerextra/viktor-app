import BackBtn from "@/components/BackBtn";
import { SignedIn } from "@/components/SignedIn";
import { GetAngebot } from "@/wailsjs/go/main/App";
import { db } from "@/wailsjs/go/models";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AngebotForm from "./form";

export default function EditAngebot() {
  const { id } = useParams();
  const [Angebot, setAngebot] = useState<db.Angebot | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (id == null) return;
      const res = await GetAngebot(id);
      setAngebot(res);
    })();
  }, [id]);

  return (
    <SignedIn>
      <div className="panel">
        <BackBtn href="/CMS/Angebote" />
        <div className="panel-label">{Angebot?.Title} bearbeiten</div>
        <div className="p-2 mt-2">
          <AngebotForm Angebot={Angebot} />
        </div>
      </div>
    </SignedIn>
  );
}
