import { GetAuthState } from "@/wailsjs/go/main/App";
import type { main } from "@/wailsjs/go/models";
import { useEffect, useState } from "react";

export default function useLogin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [user, setUser] = useState<main.AuthState | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setIsloading(true);
      const res = await GetAuthState();
      if (res.username != "" && res.mail != "") {
        setLoggedIn(true);
        setUser(res);
      }
      setIsloading(false);
    })();
  }, []);
  return { loggedIn, isLoading, user };
}
