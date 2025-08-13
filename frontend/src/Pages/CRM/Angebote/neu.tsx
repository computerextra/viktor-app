import BackBtn from "@/components/BackBtn";
import AngebotForm from "./form";
//   TODO: Auth einbauen
export default function NewAngebot() {
  return (
    <div className="panel">
      <BackBtn href="/CMS/Angebote" />
      <div className="panel-label">Angebot anlegen</div>
      <div className="p-2 mt-2">
        <AngebotForm />
      </div>
    </div>
  );
}
