import { CheckAdmin } from "@/wailsjs/go/main/App";
import { useEffect, useState } from "react";

export default function useAdmin() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await CheckAdmin();
      if (!res) return;
      setAdmin(true);
    })();
  }, []);

  return admin;
}
