//Variables to store API key and API url
const API_KEY = 'b99f308a84c42a7a2c701a26eba18058'
const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=${API_KEY}`

const weatherApp = document.getElementById('weatherApp')

fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
        weatherApp.innerHTML += `
        <p>City: ${data.name}</p>
        <p>Temperature: ${Math.round(data.main.temp * 10) / 10}</p>
        <p>Type of weather: ${data.weather[0].description}</p>
        `
        console.log(data)
    })  
    .catch((err) => console.log("Error: ", err))