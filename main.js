const input = document.getElementById("city");
const mainDiv = document.getElementsByClassName("weather-info")[0];
const inputDiv = document.getElementById("input-div");

// handling the user input for city names
let userInput = "";
function onChange(event) {
  userInput = event.target.value;
}

// handling the temp conversion into celcius
function convertTemperatureIntoCelcius(x) {
  return `${Math.round(x - 273.15)}°`;
}

// handling the current user location, getting coordinates and saving them in variables for later use
let latitude;
let longitude;
async function geoFindMe() {
  const status = document.getElementById("geo-status");
  const mapLink = document.getElementById("map-link");
  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    status.textContent = "";
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Geolocation`;
    showCurrentWeather();
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

// window.onload, the app detects the user location and show weather accordingly
window.addEventListener("load", function () {
  geoFindMe();
  inputDiv.style.display = "none";
});

// getting the user input and on clicking the show button shows current weather
function renderForCity() {
  inputDiv.style.display = "block";
  document.getElementById("weather-data").style.display = "none";
  input.addEventListener("input", onChange);
  document
    .getElementById("allow-button")
    .addEventListener("click", showCurrentWeather);
}

// rendering dynamically header section
function headerSection(response) {
  const city = document.createElement("h2");
  city.innerText = `${response.name}`;
  mainDiv.appendChild(city);
  const icon = document.createElement("h4");
  icon.innerText = `${response.weather[0].main}`;
  mainDiv.appendChild(icon);
  const iconImg = document.createElement("img");
  Object.assign(iconImg, {
    className: "weather-icon",
    src: `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`,
  });
  const src = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
  document.body.style.backgroundImage = `url(${src})`;
  mainDiv.appendChild(iconImg);
  const temp = document.createElement("h1");
  temp.innerText = getCurrentTemp(response);
  mainDiv.appendChild(temp);

  const hrElement = document.createElement("hr");
  mainDiv.appendChild(hrElement);
}

const getCurrentTemp = (response) =>
  convertTemperatureIntoCelcius(response.main.temp);

// rendering dynamically description section
function descriptionSection(response) {
  const paragraph = document.createElement("p");
  const description = `Today: ${
    response.weather[0].description
  } currently. It's ${getCurrentTemp(response)}, 
            the high today was forecast as ${convertTemperatureIntoCelcius(
              response.main.temp_max
            )} and 
            the low today was forecast as ${convertTemperatureIntoCelcius(
              response.main.temp_min
            )}.`;
  paragraph.innerText = description;
  mainDiv.appendChild(paragraph);
  const hrElement2 = document.createElement("hr");
  mainDiv.appendChild(hrElement2);
}

// rendering dynamically info section
function infoSection(response) {
  const infoDiv = document.createElement("div");
  mainDiv.appendChild(infoDiv);

  const currentTemp = document.createElement("h3");
  currentTemp.innerText = `Current temperature: ${getCurrentTemp(response)}`;
  infoDiv.appendChild(currentTemp);
  const feelsLike = document.createElement("h3");
  feelsLike.innerText = `Feels like: ${convertTemperatureIntoCelcius(
    response.main.feels_like
  )}`;
  infoDiv.appendChild(feelsLike);

  const maxTemp = document.createElement("h3");
  maxTemp.innerText = `Maximum today: ${convertTemperatureIntoCelcius(
    response.main.temp_max
  )}`;
  infoDiv.appendChild(maxTemp);
  const minTemp = document.createElement("h3");
  minTemp.innerText = `Minimum today: ${convertTemperatureIntoCelcius(
    response.main.temp_min
  )}`;
  infoDiv.appendChild(minTemp);

  const sunrise = document.createElement("h3");
  const sunriseTime = new Date(response.sys.sunrise * 1000);
  sunrise.innerText = `Sunrise: ${addOneZero(
    sunriseTime.getHours()
  )}:${addOneZero(sunriseTime.getMinutes())}:${addOneZero(
    sunriseTime.getSeconds()
  )}`;
  infoDiv.appendChild(sunrise);
  const sunset = document.createElement("h3");
  const sunsetTime = new Date(response.sys.sunset * 1000);
  sunset.innerText = `Sunset: ${addOneZero(sunsetTime.getHours())}:${addOneZero(
    sunsetTime.getMinutes()
  )}:${addOneZero(sunsetTime.getSeconds())}`;
  infoDiv.appendChild(sunset);

  const wind = document.createElement("h3");
  wind.innerText = `Wind: ${response.wind.speed} m/s`;
  infoDiv.appendChild(wind);
  const pressure = document.createElement("h3");
  pressure.innerText = `Pressure: ${response.main.pressure} hPa`;
  infoDiv.appendChild(pressure);

  const visibility = document.createElement("h3");
  visibility.innerText = `Visibility: ${(response.visibility / 1000).toFixed(
    1
  )} km`;
  infoDiv.appendChild(visibility);
  const humidity = document.createElement("h3");
  humidity.innerText = `Humidity: ${response.main.humidity}%`;
  infoDiv.appendChild(humidity);

  infoDiv.classList.add("infoDiv");
}

// rendering all the weather information, taking the api response as input
function renderElements(response) {
  document.getElementById("weather-data").style.display = "block";
  mainDiv.style.display = "block";
  const mapLink = document.getElementById("map-link");
  mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
  mapLink.textContent = `Geolocation`;

  // creating the button for taking user input
  const anotherCityButton = document.createElement("button");
  anotherCityButton.textContent = "Add another city";
  anotherCityButton.addEventListener("click", renderForCity);
  anotherCityButton.setAttribute("id", "another-city");
  mainDiv.appendChild(anotherCityButton);

  headerSection(response);
  descriptionSection(response);
  infoSection(response);
}

function addOneZero(time) {
  return time < 10 ? "0" + time : time;
}

// calling api either by city name or coordinates
function showCurrentWeather() {
  inputDiv.style.display = "none";
  if (userInput !== "") {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=a1d744b03825e0abb2904f3057933962`
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        latitude = response.coord.lat;
        longitude = response.coord.lon;
        document.getElementsByClassName("weather-info")[0].textContent = "";
        renderElements(response);
      });
  } else if (
    latitude !== undefined &&
    longitude !== undefined &&
    userInput === ""
  ) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a1d744b03825e0abb2904f3057933962`
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        renderElements(response);
      });
  }
}
