import { useEffect, useState } from "react";

export default function Stats() {
  const [loadTime, setLoadTime] = useState(0);
  const [latency, setLatency] = useState<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [fps, setfps] = useState(0);

  let fpsAnimationId: number | null = null;
  let framecount = 0;
  let lastTime = 0;

  useEffect(() => {
    function updateFps() {
      framecount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        setfps(framecount);
        framecount = 0;
        lastTime = currentTime;
      }

      fpsAnimationId = requestAnimationFrame(updateFps);
    }

    function startFps() {
      if (!fpsAnimationId) {
        framecount = 0;
        lastTime = performance.now();
        updateFps();
      }
    }

    function stopFps() {
      if (fpsAnimationId) {
        cancelAnimationFrame(fpsAnimationId);
        fpsAnimationId = null;
        setfps(0);
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        startFps();
        measurePing();
      } else {
        stopFps();
      }
    }

    async function measurePing() {
      const start = performance.now();

      try {
        await fetch("https://www.google.com/generate_204", {
          method: "GET",
          mode: "no-cors",
          cache: "no-cache",
        });
        setLatency(Math.round(performance.now() - start));
      } catch (error) {
        setLatency(null);
      }
    }

    function updateViewPortSize() {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    }

    measurePing();
    updateViewPortSize();
    startFps();

    const perfObserver = new PerformanceObserver((list) => {
      const entry = list.getEntries()[0].toJSON();
      setLoadTime(Math.round(entry.duration));
    });
    perfObserver.observe({ type: "navigation", buffered: true });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", updateViewPortSize);

    return () => {
      stopFps();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", updateViewPortSize);
    };
  }, []);

  return (
    <div className="panel">
      <div className="panel-label">Stats</div>
      <div>
        load <span className="value">{loadTime} ms</span>
      </div>
      <div>
        ping <span className="value">{latency || "?"} ms</span>
      </div>
      <div>
        fps <span className="value">{fps}</span>
      </div>
      <div>
        <span className="value">{viewportWidth}</span> x{" "}
        <span className="value">{viewportHeight}</span>
      </div>
    </div>
  );
}
