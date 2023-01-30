const temp = document.getElementById('temp');
    date = document.getElementById('date-time');


let currentCity = '';
let currentUnit = 'f';
let hourlyWeekly = 'week';

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
    date.InnerText = getDateTime();
}, 1000);

//function to go public

function getPublicIp() {
    fetch("https://geolocation-db.com/json/",
    {
    method: "GET",
    })
    .then((response) => response.json())
        .then((data) => {
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
        })
        .then((response) => response.json())
            .then((data) => {
                let today = data.currentConditions;
                if(unit === "c") {
                    temp.innerText = today.temp;
                } else {
                    temp.innerText == celsiusToFahrenheit(today.temp);
                }
                //console.log(data);
            });
}

//convert C to F
function celsiusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}