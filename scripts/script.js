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
cityName = "London";

/* Current weather data */
const CURRENT_QUERY_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OW_API_KEY}`;
$.ajax({
    url: CURRENT_QUERY_URL,
    method: "GET"
})
.then(function(response) {
    console.log(response)

    /* Display icon */
    var iconCode = response.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png"
    $("#current-weather-icon").attr("src", iconURL);

    // const LON = response.coord.lon;
    // const LAT = response.coord.lat;

    /* 7 day forecast */
    // const SEVEN_DAY_FORECAST_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${LAT}&lon=${LON}&appid=${OW_API_KEY }`
    // $.ajax({
    //     url: SEVEN_DAY_FORECAST_URL,
    //     method: "GET"
    // }).then(function(response) {
    //     console.log(response);
    //     for (let i = 0; i < response.daily.length; i++) {
    //         var unix_timestamp = response.daily[i].dt
    //         var date = new Date(unix_timestamp * 1000);
    //         console.log(date);
    //     }
    // })
}); 

/* 5 day forecast data */
/*
    var unix_timestamp = response.daily[i].dt
            var date = new Date(unix_timestamp * 1000);
            console.log(date);
*/
const FIVE_DAY_FORECAST_URL =`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${OW_API_KEY}`;
$.ajax({
    url: FIVE_DAY_FORECAST_URL,
    method: "GET"
})
.then(function(response) {
    console.log(response);
});

