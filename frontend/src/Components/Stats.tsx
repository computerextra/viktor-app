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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        framecount = 0;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        lastTime = currentTime;
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
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
        console.error(error);
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
      <div className="grid grid-cols-2 mt-1">
        <span>load</span>
        <span className="text-slate-400">{loadTime} ms</span>
      </div>
      <div className="grid grid-cols-2">
        <span>ping</span>
        <span className="text-slate-400">{latency || "?"} ms</span>
      </div>
      <div className="grid grid-cols-2">
        <span>fps</span>
        <span className="text-slate-400">{fps}</span>
      </div>
      <div className="grid grid-cols-2">
        <span>viewport</span>
        <span className="text-slate-400">
          {viewportWidth}x{viewportHeight} px
        </span>
      </div>
    </div>
  );
}
