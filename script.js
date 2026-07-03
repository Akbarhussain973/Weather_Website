try {
  const form = document.querySelector("#weather_form");
  const input = document.querySelector("#user_input");
  let temperature = document.querySelector("#temperature");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let condition = document.querySelector("#condition");
  const cityElement = document.querySelector("#city");
  const weatherCard = document.querySelector("#weather");
  const loader = document.querySelector("#loader");

  function getWeatherCondition(code) {
    switch (code) {
      case 0:
        return "☀️ Clear Sky";

      case 1:
        return "🌤️ Mainly Clear";

      case 2:
        return "⛅ Partly Cloudy";

      case 3:
        return "☁️ Overcast";

      case 45:
      case 48:
        return "🌫️ Fog";

      case 51:
      case 53:
      case 55:
        return "🌦️ Drizzle";

      case 61:
      case 63:
      case 65:
        return "🌧️ Rain";

      case 71:
      case 73:
      case 75:
        return "❄️ Snow";

      case 80:
      case 81:
      case 82:
        return "🌧️ Rain Showers";

      case 95:
        return "⛈️ Thunderstorm";

      case 96:
      case 99:
        return "⛈️ Thunderstorm with Hail";

      default:
        return "❓ Unknown Weather";
    }
  }

  function getWeatherImageQuery(code) {
    switch (code) {
      case 0:
        return "clear blue sky mountains";

      case 1:
      case 2:
      case 3:
        return "cloudy mountains landscape";

      case 45:
      case 48:
        return "foggy forest mountains";

      case 51:
      case 53:
      case 55:
        return "light rain mountains";

      case 61:
      case 63:
      case 65:
        return "rainy mountains landscape";

      case 71:
      case 73:
      case 75:
        return "snow mountains";

      case 80:
      case 81:
      case 82:
        return "rain storm mountains";

      case 95:
      case 96:
      case 99:
        return "thunderstorm dramatic sky";

      default:
        return "beautiful nature landscape";
    }
  }

  function showError(message) {
    cityElement.textContent = "❌ Error";
    temperature.textContent = "--°C";
    condition.textContent = message;
    humidity.textContent = "--%";
    wind.textContent = "-- km/h";

    condition.classList.add("error");
  }

  async function getWeather(city) {
    loader.style.display = "block";

    try {
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Try another city.");
      }

      const location = data.results[0];
      const latitude = location.latitude;
      const longitude = location.longitude;

      const url2 = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
      const response2 = await fetch(url2);
      const data2 = await response2.json();

      const imageResponse = await fetch(
        `/api/pexels?query=${encodeURIComponent(location.name + " city")}&page=${randomPage}`,
      );

      const imageData = await imageResponse.json();

      const weatherQuery = getWeatherImageQuery(data2.current.weather_code);

      const weatherImageResponse = await fetch(
        `/api/pexels?query=${encodeURIComponent(weatherQuery)}&page=${randomPage}`,
      );

      const weatherImageData = await weatherImageResponse.json();

      console.log(weatherImageData);
      console.log(imageData);
      console.log(city);
      console.log(data);
      console.log(data2);

      const imageUrl = imageData.photos[0].src.large2x;
      document.body.style.backgroundImage = `url(${imageUrl})`;

      weatherCard.style.backgroundImage = `url(${weatherImageData.photos[0].src.large})`;
      weatherCard.style.backgroundSize = "cover";
      weatherCard.style.backgroundPosition = "center";

      cityElement.textContent = `📍 ${location.name}`;

      temperature.textContent = `${Math.round(data2.current.temperature_2m)}°C`;
      humidity.textContent = `💧 ${data2.current.relative_humidity_2m}%`;
      wind.textContent = `💨 ${data2.current.wind_speed_10m} km/h`;
      condition.classList.remove("error");
      condition.textContent = getWeatherCondition(data2.current.weather_code);
    } catch (error) {
      showError(error.message);
    } finally {
      loader.style.display = "none";
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const city = input.value.trim();

    if (city === "") {
      alert("Please enter a city name.");
      input.focus();
      return;
    }

    getWeather(city);

    input.value = "";
  });
} catch (e) {
  console.log(e);
}
