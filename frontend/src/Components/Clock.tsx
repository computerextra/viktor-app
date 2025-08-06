import { useEffect, useState } from "react";

export default function Clock() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentHrs, setCurrentHrs] = useState("");
  const [currentMin, setCurrentMin] = useState("");
  const [currentSec, setCurrentSec] = useState("");

  useEffect(() => {
    function updateTime() {
      const now = new Date();

      setCurrentHrs(now.getHours().toString().padStart(2, "0"));
      setCurrentMin(now.getMinutes().toString().padStart(2, "0"));
      setCurrentSec(now.getSeconds().toString().padStart(2, "0"));
      setCurrentDate(
        now.toLocaleDateString("de-de", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }

    updateTime();
    const now = new Date();
    const msUntilNextSecond = 1000 - now.getMilliseconds();

    let clockInterval: number | undefined = undefined;

    const timeout = setTimeout(() => {
      updateTime();
      clockInterval = setInterval(updateTime, 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(timeout);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <div className="panel">
      <div className="panel-label">datetime</div>
      <div className="clock">
        {currentHrs}
        <span className="colon">:</span>
        {currentMin}
        <span className="colon">:</span>
        {currentSec}
      </div>
      <div className="date">{currentDate}</div>
    </div>
  );
}
