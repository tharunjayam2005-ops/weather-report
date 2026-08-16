import { useState } from "react";
import axios from "axios";
import "./WeatherApp.css";

// Get a free API key at https://openweathermap.org/api
// Sign up -> API keys tab -> copy the default key (may take a few
// minutes to activate after signup).
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// TEMPORARY DEBUG LOG — remove once you've confirmed the key loads correctly.
console.log("Loaded API key:", API_KEY);

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError("");

    try {
      const url = `${BASE_URL}?q=${encodeURIComponent(
        cityName
      )}&units=metric&appid=${API_KEY}`;

      const response = await axios.get(url);
      setWeather(response.data);
    } catch (err) {
      setWeather(null);

      if (err.response) {
        if (err.response.status === 404) {
          setError(`Couldn't find "${cityName}". Check the spelling and try again.`);
        } else if (err.response.status === 401) {
          setError("Invalid or missing API key. Check your OpenWeatherMap key.");
        } else {
          setError("Something went wrong fetching the weather. Please try again.");
        }
      } else if (err.request) {
        setError("No response from the server. Check your internet connection.");
      } else {
        setError("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError("");

    try {
      const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

      const response = await axios.get(url);
      setWeather(response.data);
    } catch (err) {
      setWeather(null);

      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid or missing API key. Check your OpenWeatherMap key.");
        } else {
          setError("Something went wrong fetching nearby weather. Please try again.");
        }
      } else if (err.request) {
        setError("No response from the server. Check your internet connection.");
      } else {
        setError("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetNearby = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied. Please allow access and try again.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out. Please try again.");
            break;
          default:
            setError("Unable to retrieve your location.");
        }
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = city.trim();

    if (!trimmed) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    fetchWeather(trimmed);
  };

  return (
    <section className="weather-card" aria-label="Weather search">
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="city-input" className="visually-hidden">
          City name
        </label>
        <input
          id="city-input"
          type="text"
          placeholder="Enter a city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
        <button type="button" className="nearby-btn" disabled={loading} onClick={handleGetNearby}>
          Nearby
        </button>
      </form>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {loading && <p className="status-message">Fetching weather data...</p>}

      {weather && !loading && (
        <article className="weather-result">
          <header className="result-header">
            <h2>
              {weather.name}
              {weather.sys?.country ? `, ${weather.sys.country}` : ""}
            </h2>
            {weather.weather?.[0]?.icon && (
              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
            )}
          </header>

          <p className="condition">{weather.weather?.[0]?.description}</p>
          <p className="temperature">{Math.round(weather.main.temp)}°C</p>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Feels like</span>
              <span className="detail-value">
                {Math.round(weather.main.feels_like)}°C
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{weather.main.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Wind</span>
              <span className="detail-value">{weather.wind?.speed} m/s</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{weather.main.pressure} hPa</span>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}

export default WeatherApp;
