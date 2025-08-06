import descriptions from "./descriptions.json";

/**
 * OpenMeteo Weather API client with data processing utilities
 */
class WeatherAPI {
  constructor() {
    this.baseUrl =
      "https://api.open-meteo.com/v1/forecast?latitude=51.3167&longitude=9.5&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,apparent_temperature,dew_point_2m,precipitation,rain,showers,snowfall,snow_depth,vapour_pressure_deficit,et0_fao_evapotranspiration,evapotranspiration,visibility,cloud_cover_high,cloud_cover_mid,cloud_cover_low,cloud_cover,surface_pressure,pressure_msl,weather_code,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_1_to_3cm,soil_moisture_0_to_1cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm,cape,lifted_index,convective_inhibition,freezing_level_height,boundary_layer_height,total_column_integrated_water_vapour,wet_bulb_temperature_2m,sunshine_duration,is_day,uv_index_clear_sky,uv_index&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,is_day,rain,showers,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,wind_direction_10m,wind_gusts_10m";
    this.cacheKey = `weather_data`;
    this.cacheExpiry = 15 * 60 * 1000;
  }

  /**
   * Get weather data from API and cache it
   */
  async getWeather(
    latitude,
    longitude,
    tempUnit,
    speedUnit,
    timeFormat = "12hr"
  ) {
    const rawData = await this._fetchWeatherData(
      latitude,
      longitude,
      tempUnit,
      speedUnit
    );
    this._cacheWeather(rawData);

    return {
      current: this._processCurrentWeather(rawData.current),
      forecast: this._processHourlyForecast(
        rawData.hourly,
        rawData.current.time,
        timeFormat
      ),
    };
  }

  /**
   * Get cached weather data with staleness info
   */
  getCachedWeather(timeFormat = "12hr") {
    const cached = this._getCachedData();

    if (!cached.data) {
      return { data: null, isStale: false };
    }

    const processedData = {
      current: this._processCurrentWeather(cached.data.current),
      forecast: this._processHourlyForecast(
        cached.data.hourly,
        cached.data.current.time,
        timeFormat
      ),
    };

    return {
      data: processedData,
      isStale: cached.isStale,
    };
  }

  /**
   * Get cached data with expiration status
   */
  _getCachedData() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return { data: null, isStale: false };

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      const isStale = now - timestamp >= this.cacheExpiry;

      return { data, isStale };
    } catch (error) {
      console.error("failed to get cached weather data:", error);
      localStorage.removeItem(this.cacheKey);
      return { data: null, isStale: false };
    }
  }

  /**
   * Clear the weather cache
   */
  clearCache() {
    localStorage.removeItem(this.cacheKey);
  }

  /**
   * Private method to fetch raw weather data from API
   */
  async _fetchWeatherData(
    latitude,
    longitude,
    tempUnit = "fahrenheit",
    speedUnit = "mph"
  ) {
    const response = await fetch(`${this.baseUrl}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }

  /**
   * Process current weather data with descriptions
   */
  _processCurrentWeather(currentData) {
    currentData.temperature_2m = currentData.temperature_2m.toFixed(0);
    currentData.wind_speed_10m = currentData.wind_speed_10m.toFixed(0);
    currentData.apparent_temperature =
      currentData.apparent_temperature.toFixed(0);
    return {
      ...currentData,
      description: this._getWeatherDescription(
        currentData.weather_code,
        currentData.is_day === 1
      ),
    };
  }

  /**
   * Process hourly forecast to get every 3rd hour starting 3 hours from current hour
   */
  _processHourlyForecast(hourlyData, currentTime, timeFormat = "12hr") {
    const currentHour = new Date(currentTime).getHours();
    const forecasts = [];

    // Find the current hour in the forecast
    let currentIndex = 0;
    for (let i = 0; i < hourlyData.time.length; i++) {
      const forecastHour = new Date(hourlyData.time[i]).getHours();
      if (forecastHour >= currentHour) {
        currentIndex = i;
        break;
      }
    }

    // Get forecasts every 3 hours starting from 3 hours after current, up to 5 forecasts
    for (
      let i = 0;
      i < 5 && currentIndex + (i + 1) * 3 < hourlyData.time.length;
      i++
    ) {
      const index = currentIndex + (i + 1) * 3;
      forecasts.push({
        time: hourlyData.time[index],
        temperature: hourlyData.temperature_2m[index].toFixed(0),
        weatherCode: hourlyData.weather_code[index],
        description: this._getWeatherDescription(
          hourlyData.weather_code[index],
          hourlyData.is_day[index] === 1
        ),
        formattedTime: this._formatTime(hourlyData.time[index], timeFormat),
      });
    }

    return forecasts;
  }

  /**
   * Get weather description from code
   */
  _getWeatherDescription(weatherCode, isDay = true) {
    const timeOfDay = isDay ? "day" : "night";
    return (
      descriptions[weatherCode]?.[timeOfDay]?.description ||
      `Code ${weatherCode}`
    ).toLowerCase();
  }

  /**
   * Format time to display (e.g., "12pm" for 12hr, "12:00" for 24hr)
   */
  _formatTime(timeString, timeFormat = "12hr") {
    const date = new Date(timeString);

    if (timeFormat === "12hr") {
      return date
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        })
        .toLowerCase();
    } else {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });
    }
  }

  /**
   * Cache weather data with timestamp
   */
  _cacheWeather(data) {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
  }
}

export default WeatherAPI;
