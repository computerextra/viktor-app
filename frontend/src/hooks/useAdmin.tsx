import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const allowedMails = [
  "johannes.kirchner@computer-extra.de",
  "christoph.salowski@computer-extra.de",
];

export default function useAdmin() {
  const [admin, setAdmin] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    if (user == null) return;
    if (user.emailAddresses.length > 1) return;
    const mail = user.emailAddresses[0].emailAddress;
    if (allowedMails.includes(mail)) {
      setAdmin(true);
    }
  }, [isLoaded, isSignedIn, user]);

  return admin;
}
