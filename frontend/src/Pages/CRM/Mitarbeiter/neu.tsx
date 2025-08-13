import BackBtn from "@/components/BackBtn";
import { SignedIn } from "@clerk/clerk-react";
import MitarbeiterForm from "./form";
//   TODO: Auth einbauen
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
