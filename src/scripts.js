let weather = {
  paris: {
    temp: 19.7,
    humidity: 80,
  },
  tokyo: {
    temp: 17.3,
    humidity: 50,
  },
  lisbon: {
    temp: 30.2,
    humidity: 20,
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100,
  },
  oslo: {
    temp: -5,
    humidity: 20,
  },
};

function checkCity(city) {
  if (Object.keys(weather).includes(city)) {
    const name = city.charAt(0).toUpperCase() + city.slice(1);

    return alert(
      `It is currently ${weather[city].temp}°C (${
        (weather[city].temp * 9) / 5 + 32
      }°F) in ${name} with a humidity of ${weather[city].humidity}%`
    );
  }

  return alert(
    "Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+sydney"
  );
}

// const city = prompt("Enter a city").trim().toLowerCase();
// checkCity(city);

//date
const dayText = document.querySelector("#day");
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const apiKey = "2980ff43226d67e53abfcdb6d457dcc8";

const changeTemperature = document.querySelectorAll(".temperature");
const temperatureText = document.querySelector("#temperature-text");
const cityText = document.querySelector("#city");
const description = document.querySelector("#description");
const temperatureType = document.querySelector("#temperature-type");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const weatherDescription = document.querySelector("#weather-description");
const buttonCurrent = document.querySelector("#button-current");
const iconElement = document.querySelector("#icon");
let currentTemp;

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function getResponse(res) {
  const data = res.data;
  currentTemp = Math.round(data.main.temp);
  temperatureText.innerHTML = currentTemp;
  cityText.innerHTML = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  description.innerHTML = data.weather[0].description;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );

  temperatureType.style.display = "inline";
  humidity.innerHTML = `Humidity: ${data.main.humidity}%`;
  wind.innerHTML = `Wind: ${data.wind.speed}km/h`;
  weatherDescription.style.display = "flex";
}

function getTemperature(city) {
  let pathApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios
    .get(pathApi)
    .then(getResponse)
    .catch(function (error) {
      if (error) {
        cityText.innerHTML = "Try another city";
        weatherDescription.style.display = "none";
      }
    });
}

function currentLocationTemperature() {
  navigator.geolocation.getCurrentPosition(handlePosition);

  function handlePosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const pathApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    axios.get(pathApi).then(getResponse);
  }
}

const date = new Date();
dayText.innerHTML = `${days[date.getDay()]} ${addZero(
  date.getHours()
)}:${addZero(date.getMinutes())}`;

changeTemperature.forEach((b) => {
  b.addEventListener("click", function (e) {
    e.preventDefault();

    changeTemperature.forEach((e) => {
      e.classList.remove("active");
    });

    if (this.classList.contains("celsius")) {
      temperatureText.innerHTML = currentTemp;
    }
    if (this.classList.contains("fahrenheit")) {
      temperatureText.innerHTML = (currentTemp * 9) / 5 + 32;
    }
    this.classList.add("active");
  });
});

const form = document.querySelector(".search-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const cityValue = this.querySelector("input");
  if (cityValue.value) getTemperature(cityValue.value);
});

buttonCurrent.addEventListener("click", function (e) {
  e.preventDefault();
  currentLocationTemperature();
});

currentLocationTemperature();
