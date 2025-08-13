import BackBtn from "@/components/BackBtn";
import { SignedIn } from "@clerk/clerk-react";
import AngebotForm from "./form";

export default function NewAngebot() {
  return (
    <SignedIn>
      <div className="panel">
        <BackBtn href="/CMS/Angebote" />
        <div className="panel-label">Angebot anlegen</div>
        <div className="p-2 mt-2">
          <AngebotForm />
        </div>
      </div>
    </SignedIn>
  );
}
