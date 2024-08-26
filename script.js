const apiKey = "72f08c0b39657cb8f3e52f34c851a4d7";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const apiUrl2 = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const inputBox = document.getElementById("user-input");
 
//functionality of enter key
inputBox.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("btn").click();
  }
});

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  const responseForecast = await fetch(apiUrl2 + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    toastr.error("Invalid City Name", "Error", {
      timeOut: 2000,
      closeButton: true,
      positionClass: "toast-top-right",
    });
  } else {
    let dataCity = await response.json();
    let dataForecast = await responseForecast.json();

    document.getElementById("cityName").innerText = dataCity.name;
    document.getElementById("temperature").innerText = Math.round(dataCity.main.temp) + "°C";
    document.getElementById("weatherType").innerText = dataCity.weather[0].main;
    document.getElementById("feelslike").innerText = dataCity.main.feels_like + "°C";
    document.getElementById("mintemp").innerText = dataCity.main.temp_min + "°C";
    document.getElementById("humidity").innerText = dataCity.main.humidity + "%";
    document.getElementById("windspeed").innerText = dataCity.wind.speed + "km/h";
    document.getElementById("maxtemp").innerText = dataCity.main.temp_max + "°C";
    document.getElementById("pressure").innerText = (dataCity.main.pressure * 0.0009869233).toPrecision(3) + " atm";
    if (dataCity.weather[0].main == "Clouds") {
      document.getElementById("weatherIcon").src = "images/cloudy.svg";
    }
    if (dataCity.weather[0].main == "Clear") {
      document.getElementById("weatherIcon").src = "images/clear.svg";
    }
    if (dataCity.weather[0].main == "Snow") {
      document.getElementById("weatherIcon").src = "images/snowy.svg";
    }
    if (dataCity.weather[0].main == "Rain") {
      document.getElementById("weatherIcon").src = "images/rainy.svg";
    }
    if (dataCity.weather[0].main == "Drizzle") {
      document.getElementById("weatherIcon").src = "images/haze.svg";
    }
    if (dataCity.weather[0].main == "Mist") {
      document.getElementById("weatherIcon").src = "images/strom.svg";
    }
    updateForUpcomingDays(dataForecast);
  }
  inputBox.value = "";
  document.activeElement.blur();
}

//by default it will show weather of mathura
checkWeather("Mathura");

//display weather function
function displayWeather() {
  let city = inputBox.value;
  city = city != "" ? city : "Mathura";
  checkWeather(city);
}

function updateForUpcomingDays(data) {
  let dateforNextDays = [];
  let weatherforNextDays = [];
  let tempForNextDays = [];

  for (let i = 0; i < 35; i++) {
    let today = new Date();
    let date = new Date(data.list[i].dt_txt);
    if (data.list[i].dt_txt.substr(11) === "12:00:00" && date.getDate() != today.getDate()) {
      weatherforNextDays.push(data.list[i].weather[0].main);
      tempForNextDays.push(data.list[i].main.temp);
      const yyyy = date.getFullYear();
      let mm = date.toLocaleString("default", { month: "long" });
      let dd = date.getDate();
      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;
      const formattedDate = dd + " " + mm + " " + yyyy;
      dateforNextDays.push(formattedDate);
    }
  }
  let i = 0;
  document.querySelectorAll(".next-day-detail-card p").forEach((el) => {
    el.innerText = dateforNextDays[i];
    i++;
  });
  i = 0;
  document.querySelectorAll(".next-day-detail-card img").forEach((el) => {
    if (weatherforNextDays[i] == "Clouds") {
      el.src = "images/cloudy.svg";
    } else if (weatherforNextDays[i] == "Clear") {
      el.src = "images/clear.svg";
    } else if (weatherforNextDays[i] == "Snow") {
      el.src = "images/snowy.svg";
    } else if (weatherforNextDays[i] == "Rain") {
      el.src = "images/rainy.svg";
    } else if (weatherforNextDays[i] == "Drizzle") {
      el.src = "images/haze.svg";
    } else if (weatherforNextDays[i] == "Mist") {
      el.src = "images/strom.svg";
    }
    i++;
  });
  i = 0;
  document.querySelectorAll(".next-day-detail-card span").forEach((el) => {
    el.innerText = tempForNextDays[i] + "°C";
    i++;
  });
}
