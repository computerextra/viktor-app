import BackBtn from "@/components/BackBtn";
import { SignedIn } from "@/components/SignedIn";
import PartnerForm from "./form";
export default function NewPartner() {
  return (
    <SignedIn>
      <div className="panel">
        <BackBtn href="/CMS/Partner" />
        <div className="panel-label">Partner anlegen</div>
        <div className="p-2 mt-2">
          <PartnerForm />
        </div>
      </div>
    </SignedIn>
  );
}
