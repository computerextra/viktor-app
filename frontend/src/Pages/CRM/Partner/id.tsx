import BackBtn from "@/components/BackBtn";
import { GetParnter } from "@/wailsjs/go/main/App";
import { db } from "@/wailsjs/go/models";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PartnerForm from "./form";

export default function EditPartner() {
  const { id } = useParams();
  const [Partner, setPartner] = useState<db.Partner | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (id == null) return;
      const res = await GetParnter(id);
      setPartner(res);
    })();
  }, [id]);

  return (
    <div className="panel">
      <BackBtn href="/CMS/Partner" />
      <div className="panel-label">{Partner?.Name} bearbeiten</div>
      <div className="p-2 mt-2">
        <PartnerForm Partner={Partner} />
      </div>
    </div>
  );
}
