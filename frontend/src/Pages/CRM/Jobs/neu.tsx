import BackBtn from "@/components/BackBtn";
import { AdminPage } from "@/components/SignedIn";
import JobForm from "./form";
export default function NewJob() {
  return (
    <AdminPage>
      <div className="panel">
        <BackBtn href="/CMS/Jobs" />
        <div className="panel-label">Job anlegen</div>
        <div className="p-2 mt-2">
          <JobForm />
        </div>
      </div>
    </AdminPage>
  );
}
