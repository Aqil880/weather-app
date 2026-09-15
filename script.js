const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const date = document.getElementById("date");

const detailTemperature = document.getElementById("detailTemperature");
const cloud = document.getElementById("cloud");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const rain = document.getElementById("rain");


searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city");
        return;
    }

    getWeather(city);
});


cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        if (city === "") {
            alert("Please enter a city");
            return;
        }

        getWeather(city);
    }
});


async function getWeather(city) {

    try {

        // 1. Convert city name into latitude and longitude
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            alert("City not found");
            return;
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // 2. Get weather using latitude and longitude
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,precipitation,weather_code&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;


        // 3. Update city
        cityName.textContent = location.name;


        // 4. Update temperature
        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;

        detailTemperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;


        // 5. Update humidity
        humidity.textContent =
            `${Math.round(current.relative_humidity_2m)}%`;


        // 6. Update cloud
        cloud.textContent =
            `${current.cloud_cover}%`;


        // 7. Update wind
        wind.textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;


        // 8. Update rain
        rain.textContent =
            `${current.precipitation} mm`;


        // 9. Update weather condition
        condition.textContent =
            getWeatherDescription(current.weather_code);


        // 10. Update date and time
        const weatherDate = new Date(current.time);

        date.textContent = weatherDate.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric"
        }) + " • " + weatherDate.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit"
        });

    }

    catch (error) {

        console.error(error);

        alert("Unable to get weather data");
    }
}


function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1 || code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Cloudy";
    }

    if (code === 45 || code === 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rainy";
    }

    if (code >= 71 && code <= 77) {
        return "Snowy";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 95 && code <= 99) {
        return "Thunderstorm";
    }

    return "Unknown";
}