//Variables to store API key and API url
const API_KEY = 'b99f308a84c42a7a2c701a26eba18058'
const CURRENT_WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=${API_KEY}`;
const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=${API_KEY}`;

// Function to format a timestamp to a readable time format
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return `${hours}:${minutes}`;
}

const weatherApp = document.getElementById('weatherApp');

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
                forecasts.forEach(forecast => {
                    const date = forecast.dt_txt.split(' ')[0];
                    if (!dailyForecasts[date]) {
                        dailyForecasts[date] = [];
                    }
                    dailyForecasts[date].push(forecast);
                });

                // Display current weather data
                const sunrise = formatTime(currentData.sys.sunrise);
                const sunset = formatTime(currentData.sys.sunset);
                weatherApp.innerHTML = `
                    <p>City: ${currentData.name}</p>
                    <p>Temperature: ${Math.round(currentData.main.temp * 10) / 10}°C</p>
                    <p>Type of weather: ${currentData.weather[0].description}</p>
                    <p>Sunrise: ${sunrise}</p>
                    <p>Sunset: ${sunset}</p>
                `;

                // Display weather forecast
                weatherApp.innerHTML += '<h2>5-Day Weather Forecast:</h2>';
                for (const date in dailyForecasts) {
                    const maxTemp = Math.max(...dailyForecasts[date].map(forecast => forecast.main.temp_max));
                    const minTemp = Math.min(...dailyForecasts[date].map(forecast => forecast.main.temp_min));
                    const dayDescription = dailyForecasts[date][0].weather[0].description;
                    const isRainy = dailyForecasts[date].some(forecast => forecast.weather[0].main.toLowerCase().includes('rain'));

                    weatherApp.innerHTML += `
                        <p>Date: ${date}</p>
                        <p>Min Temperature: ${Math.round(minTemp * 10) / 10}°C</p>
                        <p>Max Temperature: ${Math.round(maxTemp * 10) / 10}°C</p>
                        <p>Type of weather: ${dayDescription}</p>
                        <p>Rainy: ${isRainy ? 'Yes' : 'No'}</p>
                    `;
                }
            })
            .catch((err) => console.log("Error fetching forecast data: ", err));
    })
    .catch((err) => console.log("Error fetching current weather data: ", err));