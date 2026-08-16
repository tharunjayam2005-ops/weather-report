import "./App.css";
import WeatherApp from "./components/WeatherApp";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Weather Report</h1>
        <p className="app-subtitle">Search any city for real-time conditions</p>
      </header>

      <main className="app-main">
        <WeatherApp />
      </main>

      <footer className="app-footer">
        <p>
          Data provided by{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenWeatherMap
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
