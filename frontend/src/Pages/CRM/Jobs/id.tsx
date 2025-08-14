import BackBtn from "@/components/BackBtn";
import { SignedIn } from "@/components/SignedIn";
import { GetJob } from "@/wailsjs/go/main/App";
import { db } from "@/wailsjs/go/models";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import JobForm from "./form";
export default function EditJob() {
  const { id } = useParams();
  const [Job, setJob] = useState<db.Job | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (id == null) return;
      const res = await GetJob(id);
      setJob(res);
    })();
  }, [id]);

  return (
    <SignedIn>
      <div className="panel">
        <BackBtn href="/CMS/Jobs" />
        <div className="panel-label">{Job?.Name} bearbeiten</div>
        <div className="p-2 mt-2">
          <JobForm Job={Job} />
        </div>
      </div>
    </SignedIn>
  );
}
