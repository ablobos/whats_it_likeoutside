const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sunrise"),
    sunSet = document.querySelector(".sunset"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
    weatherCards = document.querySelector("#weather-cards"),
    celsiusBtn = document.querySelector(".celsius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query");

let currentCity = "";
let currentUnit = "c";
let hourlyWeek = "Week";

//updating 

function getDateTime() {
    let now = new Date (),
        hour = now.getHours(),
        minute = now.getMinutes();

        let days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

            hour = hour % 12;
            if (hour < 10) {
                hour = "0" + hour;
            } 
            if (minute < 10) {
                minute = "0" + minute;
            }

            let dayString = days[now.getDay()];
            return `${dayString}, ${hour}:${minute}`; 
}
//updating time
date.innerText = getDateTime();

setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

//getting public
function getPublicIp() {
    fetch("http://ip-api.com/json/", 
    {
    method: "GET",
    })

        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            currentCity = data.city;
            //getWeatherData(data.city , currentUnit , hourlyWeek);
        });
    }
    getPublicIp();

//function for weather data

function getWeatherData(city, unit, hourlyWeek) {
    console.log(city);
    const apiKey = "N5T5LN5MK2QZN7LWV3WZPCR59";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`, 
        {
        method: "GET",
        }
    )
            .then((response) => response.json())
            .then((data) => {
                let today = data.currentConditions;
                if(unit === "c") {
                    temp.innerText = today.temp;
                } else {
                    temp.innerText == celsiusToFahrenheit(today.temp);
                }
                currentLocation.innerText = data.resolvedAddress;
                condition.innerText = today.conditions;
                //rain.innerText = "Precipitation - 0%" + today.precipitation + "%";
                uvIndex.innerText = today.uvindex;
                windSpeed.innerText = today.windspeed;
                humidity.innerText = today.humidity + "%";
                visibility.innerText = today.visibility;
                airQuality.innerText = today.winddir;
                measureUvIndex(today.uvindex);
                updateHumidityStatus(today.humidity);
                updateVisibilityStatus(today.visibility);
                updateAirQualityStatus(today.windir);
                sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
                sunSet.innerText =  convertTimeTo12HourFormat(today.sunset);
                mainIcon.src = getIcon(today.icon);
                changeBackground(today.icon);
                if (hourlyWeek === "hourly") {
                    updateForecast(data.days[0].hours, unit , "day");
                }   else {
                    updateForecast(data.days, unit , "week");
                }
            })
            .catch((err) => {
                console.log(err);
            });
}

//convert C to F
function celsiusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}

function measureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
        uvText.innerText = "Low";
    } else if (uvIndex <= 5) {
        uvText.innerText = "Moderate";
    }   else if (uvIndex <= 7) {
        uvText.innerText = "High";
    } else if (uvIndex <= 10) {
        uvText.innerText = "Very High";
    } else {
        uvText.innerText = "Extreme";
    }
}

function updateHumidityStatus (humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";
    }
}
function updateVisibilityStatus(visibility) {
    if (visibility <= 0.3) {
        visibilityStatus.innerText = "Dense Fog";
    }   else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
    }   else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog";
    }   else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
    }   else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist";
    }   else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist";
    }   else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clean Air";
    }   else {
        visibilityStatus.innerText = "Very Clean Air";
    }
}
function updateAirQualityStatus(airQuality) {
    if (airQuality <= 50) {
        airQualityStatus.innerText = "Good";
    } else if (airQuality <= 100) {
        airQualityStatus.innerText = "Moderate";
      } else if (airQuality <= 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
      } else if (airQuality <= 200) {
        airQualityStatus.innerText = "Unhealthy";
      } else if (airQuality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy";
      } else {
        airQualityStatus.innerText = "Hazardous"; 
    }
}


function convertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
       hour = hour & 12;
       hour = hour ? hour : 12; //0 hr ends up as 12
       hour = hour < 10 ? "0" + hour : hour; 
       minute = minute < 10 ? "0" + minute : minute;
       let strTime = hour + ":" + minute + ampm;
       return strTime; 
}

function getIcon(condition) {
    if (condition ===   "Partly-cloudy-day") {
        return "Images/cloudy.png";
    } else if (condition === "partly-cloudy-night") {
        return "Images/cloudy.png";
    } else if (condition === "rain") {
        return "Images/rainy-day.jpg";
    } else if (condition === "clear-day") {
        return "Images/clear-sky.jpg";
    } else if (condition == "clear-night") {
        return "Images/clear-night.png";
    } else {
        return "Images/cloudy.png";
    }
}

function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return days[day.getDay()];
}
function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }
}

function updateForecast (data, unit, type) {
    weatherCards.innerHTML = "";

    let day = 0;
    let numCards = 0;
    // 24cards if hourly weather or 7 weekly
    if (type === "day") {
        numCards = 24;
    }   else {
        numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");

        //hour if hourly time and day name
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
            }
            let dayTemp = data[day].temp;
            if (unit === "f") {
             dayTemp = celsiusToFahrenheit(data[day].temp);
            }
            let iconCondition = data[day].icon;
            let iconSrc = getIcon(iconCondition);
            let tempUnit = "°C";
            if (unit === "f") {
                tempUnit = "°F";
            }
            card.innerHTML = `
            <h2 class="day-name">${dayName}</h2>
            <div class="card-icon>
            <img src ="${iconSrc}" alt="" />
            </div>
            <div class="day-temp">
            <h2 class="temp">${dayTemp}</h2>
            <span class="temp-unit">${tempUnit}</span>
            </div>
            `;

            weatherCards.appendChild(card);
            day++;
    }
}

function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";
        if (condition === "partly-cloudy-day") {
            bg = "Images/partly-cloudy.jpg";
        } else if (condition === "partly-cloudy-night") {
            bg = "Images/clear-sky.jpg";
        } else if (condition === "rain") {
            bg = "Images/rainy-day.jpg";
        } else if (condition === "clear-day") {
            bg = "Images/clear-sky.jpg";
        } else if (condition == "clear-night") {
            bg = "Images/clear-night-sky.jpg";
        } else {
            bg = "Images/good-question1.jpg";
        }
        body.style.backgroundImage = `url(${bg})`;
}

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});
celsiusBtn.addEventListener("click", () => {
    changeUnit("c");
});


function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
        {
            //to change unit on doc
            tempUnit.forEach((elem) => {
                elem.innerText = `°${unit.toUpperCase()}`;
            });
            if (unit === "c") {
                celsiusBtn.classList.add("active");
                fahrenheitBtn.classList.remove("active");
            }   else {
                celsiusBtn.classList.remove("active");
                fahrenheitBtn.classList.add("active");
            }
            //weather fetching after changing the unit
            getWeatherData(currentCity, currentUnit, hourlyWeek);
        }
    }
  }

hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
  });

  weekBtn.addEventListener("click", () => {
    changeTimeSpan("week");
  });

   function changeTimeSpan(unit) {
    if (hourlyWeek !== unit) {
        hourlyWeek = unit;
        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.add("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyWeek);
        }
    }
   
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let location = search.value;
        if (location) {
            currentCity = location;
            getWeatherData(currentCity, currentUnit, hourlyWeek);
        }
    });
  //getWeatherData("Boston", "c" , "hourlyWeekly")