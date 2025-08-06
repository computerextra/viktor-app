import { useEffect, useState } from "react";
// @ts-expect-error no types
import WeatherAPI from "../weather-api.js";

const lat = 51.3157833;
const lon = 9.4978479;
const tempUnit = "celcius";
const speedUnit = "kph";
const timeFormat = "24hr";

export default function Weather() {
  const [current, setCurrent] = useState();
  const [forecast, setForecast] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(false);

  const weatherAPI = new WeatherAPI();

  function refreshWeather() {
    weatherAPI.clearCache();
    loadWeather();
  }

  async function loadWeather() {
    setLoading(true);
    const cached = weatherAPI.getCachedWeather(timeFormat);
    if (cached.data) {
      setCurrent(cached.data.current);
      setForecast(cached.data.forecast);

      if (!cached.isStale) {
        setError(null);
        setLoading(false);
        return;
      }
    }

    try {
      setError(null);
      const data = await weatherAPI.getWeather(
        lat,
        lon,
        tempUnit,
        speedUnit,
        timeFormat
      );
      setCurrent(data.current);
      setForecast(data.forecast);
    } catch (err) {
      setError("failed to load weather");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        loadWeather();
      }
    }

    if (initialLoad) {
      setInitialLoad(false);
      return;
    }

    refreshWeather();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="panel">
      <button
        className="widget-label"
        onClick={refreshWeather}
        disabled={loading}
      >
        {loading ? "loading..." : "weather"}
      </button>

      {error ? (
        <div className="error">{error}</div>
      ) : (
        current && (
          <>
            {/*  @ts-expect-error no types */}
            <div className="temp">{current.temperature_2m}</div>
            {/*  @ts-expect-error no types */}
            <div className="description">{current.description}</div>
            <br />
            <div className="stats">
              <div className="col">
                <div>
                  humi {/*  @ts-expect-error no types */}
                  <span className="value">{current.relative_humidity_2m}%</span>
                </div>
                <div>
                  prec{" "}
                  <span className="value">
                    {/*  @ts-expect-error no types */}
                    {current.precipitation_probability}%
                  </span>
                </div>
              </div>
              <div className="col">
                <div>
                  wind{" "}
                  <span className="value">
                    {/*  @ts-expect-error no types */}
                    {current.wind_speed_10m} {speedUnit}
                  </span>
                </div>
                <div>
                  feel {/*  @ts-expect-error no types */}
                  <span className="value">{current.apparent_temperature}°</span>
                </div>
              </div>
              <br />
              <div className="forecast">
                <div className="col">
                  {/*  @ts-expect-error no types */}
                  {forecast.map((x, idx) => (
                    <div className="forecast-time" key={idx}>
                      {x.formattedTime}
                    </div>
                  ))}
                </div>
                <div className="col">
                  <div className="col">
                    {/*  @ts-expect-error no types */}
                    {forecast.map((x, idx) => (
                      <div className="forecast-temp" key={idx}>
                        {x.temperature}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col">
                  <div className="col">
                    {/*  @ts-expect-error no types */}
                    {forecast.map((x, idx) => (
                      <div className="forecast-weather" key={idx}>
                        {x.description}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
