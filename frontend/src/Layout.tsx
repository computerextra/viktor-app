import { useState } from "react";
import Clock from "./Components/Clock";
import Stats from "./Components/Stats";
import Weather from "./Components/Weather";

export default function Layout() {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <main>
      <div className="container">
        <div className="top">
          <Clock />
          <Stats />
        </div>
        <div className="widgets">
          <Weather />
          {/* TODOist */}
        </div>
        {/* Links */}
      </div>
      <button
        className="settings-btn"
        onClick={() => setShowSettings((prev) => !prev)}
        aria-label="Open Settings"
      >
        Settings
      </button>
      {showSettings && <>{/* Settings */}</>}
    </main>
  );
}
