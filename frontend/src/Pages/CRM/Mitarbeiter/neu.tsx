import BackBtn from "@/components/BackBtn";
import { AdminPage } from "@/components/SignedIn";
import MitarbeiterForm from "./form";
export default function NewMitarbeiter() {
  return (
    <AdminPage>
      <div className="panel">
        <BackBtn href="/CMS/Mitarbeiter" />
        <div className="panel-label">Mitarbeiter anlegen</div>
        <div className="p-2 mt-2">
          <MitarbeiterForm />
        </div>
      </div>
    </AdminPage>
  );
}
