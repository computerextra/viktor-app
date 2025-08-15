import BackBtn from "@/components/BackBtn";
import { AdminPage } from "@/components/SignedIn";
import { GetOneMitarbeiter } from "@/wailsjs/go/main/App";
import { db } from "@/wailsjs/go/models";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import MitarbeiterForm from "./form";
export default function EditMitarbeiter() {
  const { id } = useParams();
  const [Mitarbeiter, setMitarbeiter] = useState<db.Mitarbeiter | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      if (id == null) return;
      const res = await GetOneMitarbeiter(id);
      setMitarbeiter(res);
    })();
  }, [id]);

  return (
    <AdminPage>
      <div className="panel">
        <BackBtn href="/CMS/Mitarbeiter" />
        <div className="panel-label">{Mitarbeiter?.Name} bearbeiten</div>
        <div className="p-2 mt-2">
          <MitarbeiterForm Mitarbeiter={Mitarbeiter} />
        </div>
      </div>
    </AdminPage>
  );
}
