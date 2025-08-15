import { SignedIn } from "@/components/SignedIn";
import { Button } from "@/components/ui/button";
import { DeleteProfile } from "@/wailsjs/go/main/App";
import { WindowReloadApp } from "@/wailsjs/runtime/runtime";
import { useState } from "react";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    const res = await DeleteProfile();
    if (res) {
      WindowReloadApp();
    }
    setLoading(false);
  };

  return (
    <SignedIn>
      <div className="panel">
        <div className="panel-label">Profil</div>
        <div className="p-1">
          <h3>Aktuell ist eine Bearbeitung des Profils nicht vorgesehen.</h3>
          <Button
            className="mt-2"
            disabled={loading}
            variant={"destructive"}
            onClick={handleClick}
          >
            {loading ? "Bitte warten..." : "Profil Löschen"}
          </Button>
        </div>
      </div>
    </SignedIn>
  );
}
