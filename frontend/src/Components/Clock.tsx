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

    let clockInterval: NodeJS.Timeout | undefined = undefined;

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
      <div className="panel-label">Zeit</div>
      <div className="text-5xl font-light leading-12 mt-1 mb-0 ms-2 me-0">
        {currentHrs}
        <span>:</span>
        {currentMin}
        <span>:</span>
        {currentSec}
      </div>
      <div className="text-2xl leading-8 m-0">{currentDate}</div>
    </div>
  );
}
