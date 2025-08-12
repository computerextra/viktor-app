import BackBtn from "@/components/BackBtn";
import AbteilungForm from "./form";

// TODO: ALLES

export default function NewAbteilung() {
  return (
    <div className="panel">
      <BackBtn href="/CMS/Abteilungen" />
      <div className="panel-label">Abteilung anlegen</div>
      <div className="p-2 mt-2">
        <AbteilungForm />
      </div>
    </div>
  );
}
