import { Outlet } from "react-router";
import Clock from "./components/Clock";
import Links from "./components/Links";
import Stats from "./components/Stats";

export default function Layout() {
  return (
    <main className="container mx-auto flex flex-col mt-5">
      <div className="flex flex-col gap-4 w-full">
        <Links />
        <div className="container mx-auto print:hidden">
          <div className="grid grid-cols-2 gap-4">
            <Clock />
            <Stats />
          </div>
        </div>
        <div className="my-5">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
