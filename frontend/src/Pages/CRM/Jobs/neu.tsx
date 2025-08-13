import BackBtn from "@/components/BackBtn";
import { SignedIn } from "@clerk/clerk-react";
import JobForm from "./form";
//   TODO: Auth einbauen
export default function NewJob() {
  return (
    <SignedIn>
      <div className="panel">
        <BackBtn href="/CMS/Jobs" />
        <div className="panel-label">Job anlegen</div>
        <div className="p-2 mt-2">
          <JobForm />
        </div>
      </div>
    </SignedIn>
  );
}
