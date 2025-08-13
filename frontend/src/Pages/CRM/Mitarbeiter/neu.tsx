import BackBtn from "@/components/BackBtn";
import MitarbeiterForm from "./form";

export default function NewMitarbeiter() {
  return (
    <div className="panel">
      <BackBtn href="/CMS/Mitarbeiter" />
      <div className="panel-label">Mitarbeiter anlegen</div>
      <div className="p-2 mt-2">
        <MitarbeiterForm />
      </div>
    </div>
  );
}
