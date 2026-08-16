# Weather Report App

A responsive React app that lets you search for real-time weather in any city, built with Create React App, axios, and the OpenWeatherMap API.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Get a free API key**
   - Sign up at https://home.openweathermap.org/users/sign_up
   - Go to the "API keys" tab and copy your default key
   - New keys can take a few minutes to a couple of hours to activate

3. **Add your key**
   - Copy `.env.example` to `.env`
   - Paste your key:
     ```
     REACT_APP_WEATHER_API_KEY=your_actual_key_here
     ```
   - (Restart `npm start` after adding/changing `.env` — CRA only reads env vars at startup.)

4. **Run the app**
   ```bash
   npm start
   ```
   Opens at http://localhost:3000

## Project structure

```
src/
  App.js                     # Page layout: header, main, footer
  App.css
  index.js / index.css       # Entry point + reset
  components/
    WeatherApp.js             # Search input, axios calls, useState, error handling
    WeatherApp.css            # Card styling, grid/flex, media queries
```

## How it works

- `WeatherApp.js` holds the city input in state and builds the OpenWeatherMap URL dynamically with a template literal.
- On submit, it fires a `GET` request via axios and stores the response in state with `useState`.
- Errors (invalid city, bad key, network failure) are caught and shown inline instead of crashing the UI.
- Layout uses semantic tags (`header`, `main`, `footer`, `section`, `article`) and is responsive via Flexbox/Grid plus media queries at 480px and 768px breakpoints.
