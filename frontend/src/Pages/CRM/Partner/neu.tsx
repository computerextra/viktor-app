import BackBtn from "@/components/BackBtn";
import PartnerForm from "./form";
//   TODO: Auth einbauen
export default function NewPartner() {
  return (
    <div className="panel">
      <BackBtn href="/CMS/Partner" />
      <div className="panel-label">Partner anlegen</div>
      <div className="p-2 mt-2">
        <PartnerForm />
      </div>
    </div>
  );
}
