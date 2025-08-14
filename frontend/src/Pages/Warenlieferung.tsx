import { SignedIn } from "@/components/SignedIn";
import { Button } from "@/components/ui/button";
import { SendWarenlieferung } from "@/wailsjs/go/main/App";
import { useState } from "react";

export default function Warenlieferung() {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    const res = await SendWarenlieferung();
    if (res) {
      setMessage("Mail gesendet");
    } else {
      setMessage("Fehler beim senden");
    }
    setLoading(false);
  };

  return (
    <SignedIn>
      <div className="panel">
        <div className="panel-label">Warenlieferung</div>
        <div className="p-1 mt-2">
          <Button onClick={handleClick} disabled={loading}>
            {loading ? "Bitte warten ..." : "Sende Warenlieferung"}
          </Button>
          {message && <p className="mt-5">{message}</p>}
        </div>
      </div>
    </SignedIn>
  );
}
