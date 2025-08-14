import BackBtn from "@/components/BackBtn";
import { SignedIn } from "@/components/SignedIn";
import MitarbeiterForm from "./form";
export default function NewMitarbeiter() {
  return (
    <SignedIn>
      <div className="panel">
        <BackBtn href="/CMS/Mitarbeiter" />
        <div className="panel-label">Mitarbeiter anlegen</div>
        <div className="p-2 mt-2">
          <MitarbeiterForm />
        </div>
      </div>
    </SignedIn>
  );
}
