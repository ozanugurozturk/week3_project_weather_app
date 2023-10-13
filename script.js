// Function to format a timestamp to a readable time format
function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return `${hours}:${minutes}`;
}

// Function to get the day name
function getDayName(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}
//Variables to store API key and API url for specific location
const API_KEY = "b99f308a84c42a7a2c701a26eba18058";
const CURRENT_WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=${API_KEY}`;
const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=${API_KEY}`;

const weatherApp = document.querySelector(".weather-app");

// Fetch current weather data
fetch(CURRENT_WEATHER_API_URL)
  .then((res) => res.json())
  .then((currentData) => {
    // Fetch weather forecast data for that specific location
    fetch(FORECAST_API_URL)
      .then((res) => res.json())
      .then((forecastData) => {
        // Extract the forecast data for the next 5 days
        const forecasts = forecastData.list;

        // Group forecast data by day
        const dailyForecasts = {};
        forecasts.forEach((forecast) => {
          const date = forecast.dt_txt.split(" ")[0];
          if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
          }
          dailyForecasts[date].push(forecast);
        });

        // Display current weather data
        const sunrise = formatTime(currentData.sys.sunrise);
        const sunset = formatTime(currentData.sys.sunset);
        const description = currentData.weather[0].description;
        const temperature = Math.round(currentData.main.temp * 10) / 10;

        document.querySelector(
          ".current-temperature"
        ).textContent = `${temperature} °C`;
        document.querySelector(".city").textContent = currentData.name;
        document.querySelector(".time").textContent = `Time: ${formatTime(currentData.dt)}`;
        document.querySelector(".description").textContent = `${description}`;
        document.querySelector(
          ".wind-speed"
        ).textContent = `Wind Speed ${currentData.wind.speed} m/s`;
        document.querySelector(
          ".sunrise-sunset"
        ).textContent = `Sunrise ${sunrise}   Sunset ${sunset}`;

        // Display weather forecast
        const forecastList = document.querySelector(".forecast-list");
        forecastList.innerHTML = "";

        for (const date in dailyForecasts) {
          const maxTemp = Math.max(
            ...dailyForecasts[date].map((forecast) => forecast.main.temp_max)
          );
          const minTemp = Math.min(
            ...dailyForecasts[date].map((forecast) => forecast.main.temp_min)
          );
          const dayDescription = dailyForecasts[date][0].weather[0].description;
          const isRainy = dailyForecasts[date].some((forecast) =>
            forecast.weather[0].main.toLowerCase().includes("rain")
          );

          // Calculate the day name for the forecast
          const forecastDate = new Date(date);
          const dayName = getDayName(forecastDate);

          // Extract maximum wind speed for the day's forecast
          const maxWindSpeed = Math.max(
            ...dailyForecasts[date].map((forecast) => forecast.wind.speed)
          );

          forecastList.innerHTML += `
            <li>
                ${dayName} Weather Icon <img src="design/design1/assets/Group16.png" alt="Weather Icon" />
                ${maxTemp.toFixed(1)}°C - ${minTemp.toFixed(1)}°C ${maxWindSpeed.toFixed(1)} m/s
            </li>
          `;
        }
      })
      .catch((err) => console.log("Error fetching forecast data: ", err));
  })
  .catch((err) => console.log("Error fetching current weather data: ", err));