const input = document.getElementById("city");
const mainDiv = document.getElementById("weather-data");
let userInput = "";
function onChange(event) {
    userInput = event.target.value;
}
input.addEventListener("input", onChange);

function convertTemperatureIntoCelcius(x) {
    return `${Math.floor(x - 273.15)}°`;
}

function showCurrentWeather() {
    if(userInput === "") {
        alert("Please type your city name first...");
    } else {
        document.getElementById("input-div").style.display = "none";
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=a1d744b03825e0abb2904f3057933962`)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            const city = document.createElement("h2");
            city.innerText = `${response.name}`;
            mainDiv.appendChild(city);
            const icon = document.createElement("h4");
            icon.innerText = `${response.weather[0].main}`;
            mainDiv.appendChild(icon);
            const temp = document.createElement("h1");
            temp.innerText = convertTemperatureIntoCelcius(response.main.temp);
            mainDiv.appendChild(temp);

            const hrElement = document.createElement("hr");
            mainDiv.appendChild(hrElement);

            const paragraph = document.createElement("p");
            const description = `Today: ${response.weather[0].description} currently. It's ${temp.innerText}, 
            the high today was forecast as ${convertTemperatureIntoCelcius(response.main.temp_max)} and 
            the low today was forecast as ${convertTemperatureIntoCelcius(response.main.temp_min)}.`;
            paragraph.innerText = description;
            mainDiv.appendChild(paragraph);
            const hrElement2 = document.createElement("hr");
            mainDiv.appendChild(hrElement2);

            const infoDiv = document.createElement("div");
            mainDiv.appendChild(infoDiv);

            const currentTemp = document.createElement("h3");
            currentTemp.innerText = `Current temperature: ${temp.innerText}`;
            infoDiv.appendChild(currentTemp);
            const feelsLike = document.createElement("h3");
            feelsLike.innerText = `Feels like: ${convertTemperatureIntoCelcius(response.main.feels_like)}`; 
            infoDiv.appendChild(feelsLike);

            const maxTemp = document.createElement("h3");
            maxTemp.innerText = `Maximum today: ${convertTemperatureIntoCelcius(response.main.temp_max)}`; 
            infoDiv.appendChild(maxTemp);
            const minTemp = document.createElement("h3");
            minTemp.innerText = `Minimum today: ${convertTemperatureIntoCelcius(response.main.temp_min)}°`;
            infoDiv.appendChild(minTemp);

            const sunrise = document.createElement("h3");
            const sunriseTime = new Date(response.sys.sunrise * 1000);
            sunrise.innerText = `Sunrise: ${sunriseTime.getHours()}:${sunriseTime.getMinutes()}:${sunriseTime.getSeconds()}`;
            infoDiv.appendChild(sunrise);
            const sunset = document.createElement("h3");
            const sunsetTime = new Date(response.sys.sunset * 1000);
            sunset.innerText = `Sunset: ${sunsetTime.getHours()}:${sunsetTime.getMinutes()}:${sunsetTime.getSeconds()}`; 
            infoDiv.appendChild(sunset);

            const wind = document.createElement("h3");
            wind.innerText = `Wind: ${response.wind.speed} m/s`;
            infoDiv.appendChild(wind);
            const pressure = document.createElement("h3");
            pressure.innerText = `Pressure: ${response.main.pressure} hPa`;
            infoDiv.appendChild(pressure);

            const visibility = document.createElement("h3");
            visibility.innerText = `Visibility: ${(response.visibility / 1000).toFixed(1)} km`;
            infoDiv.appendChild(visibility);
            const humidity = document.createElement("h3");
            humidity.innerText = `Humidity: ${response.main.humidity}%`;
            infoDiv.appendChild(humidity);

            infoDiv.classList.add("infoDiv");
        })
         ;
    }
}
const searchBtn = document.getElementById("clicker");
searchBtn.addEventListener("click", showCurrentWeather);

