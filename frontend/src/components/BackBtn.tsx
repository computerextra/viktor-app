import { Link } from "react-router";
import { Button } from "./ui/button";

export default function BackBtn({ href }: { href: string }) {
  return (
    <Button asChild variant={"outline"} className="mt-2 ms-2">
      <Link to={href}>Zurück</Link>
    </Button>
  );
}
