import BackBtn from "@/components/BackBtn";
import { AdminPage } from "@/components/SignedIn";
import AngebotForm from "./form";

export default function NewAngebot() {
  return (
    <AdminPage>
      <div className="panel">
        <BackBtn href="/CMS/Angebote" />
        <div className="panel-label">Angebot anlegen</div>
        <div className="p-2 mt-2">
          <AngebotForm />
        </div>
      </div>
    </AdminPage>
  );
}
