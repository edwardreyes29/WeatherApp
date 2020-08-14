/* Toggle side bar display */
$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    $('#dismiss').on('click', function () {
        $('#sidebar').addClass('active');
    });
});

// TODO: add styling to change background dynamically based on time of day


/*######## Open Weather API ########*/

/* Current weather data */
const OW_API_KEY = "de36e36780976652d3e84a5502633fce";
const NUMBER_OF_DAYS = 5;
var cityName;

// TODO: get cityName from input

// test data
cityName = "Los Angeles";

/* Current weather data */
const CURRENT_QUERY_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OW_API_KEY}`;
$.ajax({
    url: CURRENT_QUERY_URL,
    method: "GET"
})
    .then(function (response) {
        console.log(response)

        /* Display location data */
        var countryCode = response.sys.country;
        $(".city-name").html(cityName + ', ' + countryCode);

        /* Display Current Date */
        formatDate(response, "current");

        /* Display weather icon and description */
        displayIcon(response, "current");

        /* Display Temperatures in fahr*/
        const tempKelvin = parseFloat(response.main.temp);
        const tempKelvinMax = parseFloat(response.main.temp_max);
        const tempKelvinMin = parseFloat(response.main.temp_min);
        const tempKelvinFeels = parseFloat(response.main.feels_like);
        displayTemperatures(tempKelvin, tempKelvinMax, tempKelvinMin, tempKelvinFeels, "current");

        /* Display humidity and wind speed */
        const humidity = response.main.humidity;
        const windSpeed = response.wind.speed;
        $("#current-humidity").html(`Humidity: <span class="font-weight-bold">${humidity}%</span>`);
        $("#current-wind-speed").html(`Wind Speed: <span class="font-weight-bold">${windSpeed} MPH </span>`);

        // display UV Data
        displayUVIndex(response);

        // Display Tomorrow's weather
        displayTomorrowWeather(response);
    });

const displayUVIndex = (responseCurrent) => {
    /* UV  days data  */
    const lon = responseCurrent.coord.lon;
    const lat = responseCurrent.coord.lat;
    const UV_QUERY_URL = `https://api.openweathermap.org/data/2.5/uvi?appid=${OW_API_KEY}&lat=${lat}&lon=${lon}`;
    $.ajax({
        url: UV_QUERY_URL,
        method: "GET"
    }).then(function (response) {
        const uvIndex = parseInt(response.value);

        /* Determine uv risk and display results*/
        if (uvIndex < 3) {
            $("#current-uv-index").html(`UV Index: <span class="font-weight-bold">${uvIndex}</span> <span class="badge badge-success">Low</span>`);
        } else if (uvIndex <= 5) {
            $("#current-uv-index").html(`UV Index: <span class="font-weight-bold">${uvIndex}</span> <span class="badge badge-warning">Moderate</span>`);
        } else if (uvIndex <= 7) {
            $("#current-uv-index").html(`UV Index: <span class="font-weight-bold">${uvIndex}</span> <span class="badge badge-danger">High</span>`);
        } else if (uvIndex <= 10) {
            $("#current-uv-index").html(`UV Index: <span class="font-weight-bold">${uvIndex}</span> <span class="badge badge-danger">Very High</span>`);
        } else if (uvIndex >= 11) {
            $("#current-uv-index").html(`UV Index: <span class="font-weight-bold">${uvIndex}</span> <span class="badge badge-danger">Extreme</span>`);
        }
    })
}

const displayTomorrowWeather = (response) => {
    /* UV 8 days data  */
    const lon = response.coord.lon;
    const lat = response.coord.lat;
    const UV_QUERY_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OW_API_KEY}`;
        
    $.ajax({
        url: UV_QUERY_URL,
        method: "GET"
    }).then(function (response) {
        const tomorrowsData = response.daily[1];
        console.log(tomorrowsData);
        /* Display Date */
        formatDate(tomorrowsData, "tomorrow");

        /* Display tomorrow's weather icon and description */
        displayIcon(tomorrowsData, "tomorrow");

        /* Display tomorrow's temperatures */
        const tempKelvin = parseFloat(tomorrowsData.temp.day);
        const tempKelvinMax = parseFloat(tomorrowsData.temp.max);
        const tempKelvinMin = parseFloat(tomorrowsData.temp.min);
        const tempKelvinFeels = parseFloat(tomorrowsData.feels_like.day);
        displayTemperatures(tempKelvin, tempKelvinMax, tempKelvinMin, tempKelvinFeels, "tomorrow");
    })
}

const displayIcon = (data, timeline) => {
    /* Display weather icon and description */
    const iconCode = data.weather[0].icon;
    const main = data.weather[0].main;
    const description = data.weather[0].description;
    const iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png"
    $(`#${timeline}-icon`).attr("src", iconURL);
    $(`#${timeline}-main`).html(`<span class="font-weight-bold">${main}</span>`);
    $(`#${timeline}-description`).html(description);
}

const displayTemperatures = (tempKelvin, tempKelvinMax, tempKelvinMin, tempKelvinFeels, timeline) => {
    // Convert from kelvin to fahr
    const tempFahr = kToF(tempKelvin);
    const tempFahrMax = kToF(tempKelvinMax);
    const tempFahrMin = kToF(tempKelvinMin);
    const tempFahrFeels = kToF(tempKelvinFeels)
    // Display temperatures and add data-temp attributes
    $(`#${timeline}-temp`).html(tempFahr.toFixed(1)).attr("data-temp", tempKelvin);
    $(`#${timeline}-min`).html(`min: ${tempFahrMin.toFixed(1)}`).attr("data-temp", tempKelvinMin);
    $(`#${timeline}-max`).html(`max: ${tempFahrMax.toFixed(1)}`).attr("data-temp", tempKelvinMax);
    $(`#${timeline}-feels`).html(`Feels like ${tempFahrFeels.toFixed(1)}`).attr("data-temp", tempKelvinFeels);
}

// /* UV 8 days data  */
// const lon = response.coord.lon;
// const lat = response.coord.lat;
// const UV_QUERY_URL = `https://api.openweathermap.org/data/2.5/uvi/forecast?appid=${OW_API_KEY}&lat=${lat}&lon=${lon}`;
// $.ajax({
//     url: UV_QUERY_URL,
//     method: "GET"
// }).then(function (response) {
//     console.log(response);
// })

/* 5 day forecast data */
// const FIVE_DAY_FORECAST_URL =`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${OW_API_KEY}`;
// $.ajax({
//     url: FIVE_DAY_FORECAST_URL,
//     method: "GET"
// })
// .then(function(response) {
//     console.log("5 day")
//     console.log(response);
// });


/*######## Additional function ########*/
// Format Date function
const formatDate = (data, timeline) => {
    'use strict';
    var d = new Date(data.dt * 1000);
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    const date = d.getDate();
    const monthName = months[d.getMonth()];
    const getHour = d.getHours();
    const dayName = days[d.getDay()] 
    var hour;
    var period;
    if (getHour > 12) {
        hour = getHour - 12;
        period = "PM"
    } else {
        if (getHour === 0) {
            hour = 12;
        } else {
            hour = getHour;
        }

        period = "AM"
    }
    if (hour.toString().length == 1) {
        hour = "0" + hour;
    }
    var minutes = d.getMinutes();
    if (minutes.toString().length == 1) {
        minutes = "0" + minutes;
    }

    var formatted;
    if (timeline === "current") {
        formatted = `${monthName} ${date}, ${hour}:${minutes} ${period}`;
    } else if (timeline === "tomorrow") {
        formatted = `${dayName}, ${monthName} ${date}`;
    }   

    // return formatted;
    $(`#${timeline}-date`).html(formatted);
}

/* Convert kelvin to fahr 
    Formula: (0K − 273.15) × 9/5 + 32
*/
const kToF = (k) => {
    return (k - 273.15) * 9 / 5 + 32;
}

/* Convert kelvin to celsius
    Formula: 0K − 273.15 = -273.1°C
*/
const kToC = (k) => {
    return k - 273.15;
}