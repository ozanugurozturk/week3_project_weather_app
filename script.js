// Function to format a timestamp to a readable time format
function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return `${hours}:${minutes}`;
}

// Function to get the day name or today
function getDayName(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else {
    return days[date.getDay()];
  }
}

// Function to map weather icons based on the provided ID as in the web page
function mapWeatherConditionToIcon(id) {
  const iconMappings = {
    200: "11d",  // Thunderstorm with light rain
    201: "11d",  // Thunderstorm with rain
    202: "11d",  // Thunderstorm with heavy rain
    210: "11d",  // Light thunderstorm
    211: "11d",  // Thunderstorm
    212: "11d",  // Heavy thunderstorm
    221: "11d",  // Ragged thunderstorm
    230: "11d",  // Thunderstorm with light drizzle
    231: "11d",  // Thunderstorm with drizzle
    232: "11d",  // Thunderstorm with heavy drizzle
    300: "09d",  // Light intensity drizzle
    301: "09d",  // Drizzle
    302: "09d",  // Heavy intensity drizzle
    310: "09d",  // Light intensity drizzle rain
    311: "09d",  // Drizzle rain
    312: "09d",  // Heavy intensity drizzle rain
    313: "09d",  // Shower rain and drizzle
    314: "09d",  // Heavy shower rain and drizzle
    321: "09d",  // Shower drizzle
    500: "10d",  // Light rain
    501: "10d",  // Moderate rain
    502: "10d",  // Heavy intensity rain
    503: "10d",  // Very heavy rain
    504: "10d",  // Extreme rain
    511: "13d",  // Freezing rain
    520: "09d",  // Light intensity shower rain
    521: "09d",  // Shower rain
    522: "09d",  // Heavy intensity shower rain
    531: "09d",  // Ragged shower rain
    600: "13d",  // Light snow
    601: "13d",  // Snow
    602: "13d",  // Heavy snow
    611: "13d",  // Sleet
    612: "13d",  // Light shower sleet
    613: "13d",  // Shower sleet
    615: "13d",  // Light rain and snow
    616: "13d",  // Rain and snow
    620: "13d",  // Light shower snow
    621: "13d",  // Shower snow
    622: "13d",  // Heavy shower snow
    701: "50d",  // Mist
    711: "50d",  // Smoke
    721: "50d",  // Haze
    731: "50d",  // Sand/dust whirls
    741: "50d",  // Fog
    751: "50d",  // Sand
    761: "50d",  // Dust
    762: "50d",  // Volcanic ash
    771: "50d",  // Squalls
    781: "50d",  // Tornado
    800: "01d",  // Clear sky
    801: "02d",  // few clouds: 11-25%
    802: "03d",  // scattered clouds: 25-50%
    803: "04d",  // broken clouds: 51-84%
    804: "04d",  // overcast clouds: 85-100%
  };

  // Default to clear sky if ID is not found
  const defaultIcon = "01d";
  return iconMappings[id] || defaultIcon;
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
    // Fetch weather forecast data for the specific location
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
        const temperature = Math.round(currentData.main.temp * 10) / 10;

        // Get the current weather description and map it to an icon
        const currentWeatherDescription = currentData.weather[0].description;
        const capitalizedDescription = currentWeatherDescription.charAt(0).toUpperCase() + currentWeatherDescription.slice(1);
        const currentWeatherIcon = mapWeatherConditionToIcon(currentData.weather[0].id);

        document.querySelector(".current-temperature").textContent = `${temperature} °C`;
        document.querySelector(".city").textContent = currentData.name;
        document.querySelector(".time").textContent = `Time: ${formatTime(currentData.dt)}`;
        document.querySelector(".description").innerHTML = `${capitalizedDescription} <img src="https://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png" alt="${currentWeatherDescription} Icon" style="width: 40%; height: 40%;" />`;
        document.querySelector(".wind-speed").innerHTML = `<img src="/design/design1/assets 2/windy-weather.gif" alt="Wind Icon" /> ${currentData.wind.speed} m/s`;
        document.querySelector(".sunrise-sunset").innerHTML = `<img src="/design/design1/assets 2/sunrise-weather.gif" alt="Sunrise Icon" /> ${sunrise} <img src="/design/design1/assets 2/sunset-weather.gif" alt="Sunset Icon" /> ${sunset}`;

        // Display the weather forecast
        const forecastList = document.querySelector(".forecast-list");
        forecastList.innerHTML = "";

        for (const date in dailyForecasts) {
          console.log(dailyForecasts);
          //Finding the highest and lowest temperature in the array to display
          const maxTemp = Math.max(
            ...dailyForecasts[date].map((forecast) => forecast.main.temp_max)
          );
          const minTemp = Math.min(
            ...dailyForecasts[date].map((forecast) => forecast.main.temp_min)
          );
          const dayID = dailyForecasts[date][0].weather[0].id;
          // Calculate the day name for the forecast
          const forecastDate = new Date(date);
          const dayName = getDayName(forecastDate);
          // Map the weather icon using the ID
          const iconID = mapWeatherConditionToIcon(dayID);
          // Generate the icon URL based on the ID 
          const iconURL = `https://openweathermap.org/img/wn/${iconID}@2x.png`;
          // Getting the wind info
          const windSpeed = dailyForecasts[date][0].wind.speed;
          console.log(windSpeed);
          forecastList.innerHTML += `
            <li>
              ${dayName} <img src="${iconURL}" alt="Weather Icon" />
              ${maxTemp.toFixed(0)}°C-${minTemp.toFixed(0)}°C 
              <img src="/design/design1/assets 2/windy-weather.gif" alt="Wind Icon" />
              ${windSpeed.toFixed(1)}m/s
            </li>
          `;
        }
      })
      .catch((err) => console.log("Error fetching forecast data: ", err));
  })
  .catch((err) => console.log("Error fetching current weather data: ", err));