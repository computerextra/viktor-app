import { Outlet } from "react-router";
import Clock from "./Components/Clock";
import Links from "./Components/Links";
import Stats from "./Components/Stats";

export default function Layout() {
  return (
    <main>
      <div className="container">
        <Links />
        <div className="top">
          <Clock />
          <Stats />
        </div>
        <div className="panel">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
