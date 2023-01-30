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
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status");

let currentCity = "";
let currentUnit = "f";
let hourlyWeekly = "Week";

//updating 

function getDateTime() {
    let now = new Date();
    hour = now.getHours(),
    minute =now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    //12-hour
    hour = hour % 12;
    if (hour < 10) {
        hour = "0"+ hour;
    }
    if (minute < 10) {
        minute = "0" + minute; 
    }

    let dayString = days[now.getDay()];
    return `${dayString} ${hour}:${minute}`;

}
//updating time
date.innerText = getDateTime();

setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

//function to go public

function getPublicIp() {
    fetch("https://geolocation-db.com/json/",
    {
    method: "GET",
    })
    .then((response) => response.json())
        .then((data) => {
            console.log(data);
            currentCity = data.currentCity;
            getWeatherData(data.city , currentUnit , hourlyWeekly);
});
}

getPublicIp();

//function for weather data

function getWeatherData(city, unit, hourlyWeekly) {
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
                rain.innerText = "Prec -" + today.precip + "%";
                uvIndex.innerText = today.uvindex;
                windSpeed.innerText = today.windspeed;
                humidity.innerText = today.humidity + "%";
                visibility.innerText = today.visibility;
                airQuality.innerText = today.windir;
                measureUvIndex(today.uvindex);
            });
}

//convert C to F
function celsiusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}
//function for uv index

function measureUvIndex(uvIndex) {
    if(uvIndex <= 2) 
    {
    uvText.innerText= "Low";
    } else if (uvIndex <= 5) {
        uvText.innerText = "Moderate";
    } else if (uvIndex <= 7) {
        uvText.innerText = "High";
    } else if (uvIndex <= 10) {
        uvText.innerText = "Very High";
    } else {
        uvText.innerText = "Extreme";
    }
}