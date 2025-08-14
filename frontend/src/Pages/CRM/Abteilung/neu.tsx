import BackBtn from "@/components/BackBtn";
import { SignedIn } from "@/components/SignedIn";
import AbteilungForm from "./form";

export default function NewAbteilung() {
  return (
    <SignedIn>
      <div className="panel">
        <BackBtn href="/CMS/Abteilungen" />
        <div className="panel-label">Abteilung anlegen</div>
        <div className="p-2 mt-2">
          <AbteilungForm />
        </div>
      </div>
    </SignedIn>
  );
}
