// TODO: add styling to change background dynamically based on time of day

/*######## HTML interactivity ########*/

/* Displays the weather panes */
const displayWeatherPane = (timeline) => {
    $(`#${timeline}`).append(`
        <h2 class="city-name" class="w-100">Location</h2>
        <p id="${timeline}-date">Date</p>
        <div id="${timeline}-temp-container w-100" class="row">
            <div class="col-9 bg-info d-flex p-0">
                <div class="bg-success w-100 pl-3">
                    <p id="${timeline}-min-max" class="align-self-center m-0">
                        <span id="${timeline}-min" class="fahr-display">min: -- </span>
                        <img src="assets/icons/dot.svg">
                        <span id="${timeline}-max" class="fahr-display">max: --</span>
                    </p>
                    <div class="bg-primary w-100">
                        <h3 id="${timeline}-temp" class="align-self-center m-0 fahr-display"
                            style="font-size:4rem;">--</h3>
                    </div>
                    <p id="${timeline}-feels" class="fahr-display" class="align-self-center m-0">Feels like --
                    </p>
                </div>

            </div>
            <div id="${timeline}-weather-container" class="col-3 bg-danger">
                <div>
                    <img src="" id="${timeline}-icon" class="img-fluid">
                    <p id="${timeline}-main" class="m-0"></p>
                    <p id="${timeline}-description" class="m-0" style="font-size: x-small"></p>
                </div>
            </div>
            <div id="${timeline}-info-container" class="pl-3 bg-info w-100">
                <div class="row w-100">
                    <div class="col-6">
                        <div class="text-secondary">Humidity:</div>
                        <div class="text-secondary">Wind:</div>
                        <div class="text-secondary">UV index:</div>
                    </div>
                    <div class="col-6">
                        <div id="${timeline}-humidity">--%</div>
                        <div id="${timeline}-wind-speed">-- mph</div>
                        <div id="${timeline}-uv-index">--</div>
                    </div>
                </div>
            </div>
        </div>`
    )
}
/* Display weather panes for current day and tomorrow*/
displayWeatherPane("current");
displayWeatherPane("tomorrow");

/* create card elements for bootstrap accordion */
const displayCards = (dataArray) => {
    for (let i = 0; i < 5; i++) {
        $(".accordion").append(`
            <div class="card">
            <div class="card-header" id="headingOne">
                <h2 class="mb-0">
                    <div class="d-flex">
                        <button class="btn btn-block text-left pl-0" type="button"
                            data-toggle="collapse" data-target="#collapse-${i + 1}" aria-expanded="true"
                            aria-controls="collapse-${i + 1}">
                            ${dataArray[i].date}
                            <p class="m-0 text-secondary" style="font-size:0.9rem;">${dataArray[i].description}</p>
                        </button>
                        <img src="${dataArray[i].icon_url}"></img>
                        <div class="ml-2 mb-2 mt-3 text-right">
                            <p class="m-0 degree-display" data-temp="${dataArray[i].temp_day}" style="font-size: 0.9rem;">${parseInt(kToF(dataArray[i].temp_day))}</p>
                            <p class="m-0 degree-display data-temp="${dataArray[i].temp_night}" text-secondary" style="font-size: 0.9rem;">${parseInt(kToF(dataArray[i].temp_night))}</p>
                        </div>
                    </div>
                </h2>
            </div>
            <div id="collapse-${i + 1}" class="collapse" aria-labelledby="headine-${i + 1}"
                data-parent="#accordionExample">
                <div class="card-body">
                    <div class="row w-100">
                        <div class="col-6">
                            <div class="text-secondary">Humidity:</div>
                            <div class="text-secondary">Wind:</div>
                            <div class="text-secondary">UV index:</div>
                        </div>
                    <div class="col-6">
                        <div>${dataArray[i].humidity}%</div>
                        <div>${dataArray[i].wind_speed} mph ${dataArray[i].wind_direction}</div>
                        <div>${dataArray[i].uvi} ${getUVIAlert(parseInt(dataArray[i].uvi))}</div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        `)
    }
}
/* Display cards */
// displayCards();


/* Toggle side bar display */
$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('.overlay').addClass('active');
    });
    $('#dismiss').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').removeClass('active');
    });
});

/*######## Open Weather API ########*/

/* Current weather data */
const OW_API_KEY = "de36e36780976652d3e84a5502633fce";
const NUMBER_OF_DAYS = 5;
var cityName;

// TODO: get cityName from input

// test data
cityName = "Los Angeles";

/* Current weather data */
const displayCurrentWeather = (cityName) => {
    // Set Google Search url
    $("#web-results").attr("href", `http://www.google.com/search?q=${cityName}+weather`);

    const CURRENT_QUERY_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OW_API_KEY}`;
    $.ajax({
        url: CURRENT_QUERY_URL,
        method: "GET"
    })
        .then(function (response) {
            /* Display location data */
            var countryCode = response.sys.country;
            $(".city-name").html(cityName + ', ' + countryCode);

            /* Display Current Date */
            var d = new Date(response.dt * 1000);
            var currentDate = formatDate(d, "current");
            $("#current-date").html(currentDate);

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
            const windDirection = getWindDirection(parseInt(response.wind.deg));

            $("#current-humidity").html(`${humidity}%`);
            $("#current-wind-speed").html(`${windSpeed} mph ${windDirection}`);

            // display UV Data
            getUVIndexData(response);

            // Display Tomorrow's weather
            displayTomorrowWeather(response);
        });
}

displayCurrentWeather(cityName);

const displayTomorrowWeather = (response) => {
    const lon = response.coord.lon;
    const lat = response.coord.lat;
    const UV_QUERY_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OW_API_KEY}`;

    $.ajax({
        url: UV_QUERY_URL,
        method: "GET"
    }).then(function (response) {
        // console.log(response);
        const tomorrowsData = response.daily[1];

        /* Display Date */
        var d = new Date(tomorrowsData.dt * 1000);
        console.log(d)
        var tomorrowDate = formatDate(d, "tomorrow");
        $("#tomorrow-date").html(tomorrowDate);

        /* Display tomorrow's weather icon and description */
        displayIcon(tomorrowsData, "tomorrow");

        /* Display tomorrow's temperatures */
        const tempKelvin = parseFloat(tomorrowsData.temp.day);
        const tempKelvinMax = parseFloat(tomorrowsData.temp.max);
        const tempKelvinMin = parseFloat(tomorrowsData.temp.min);
        const tempKelvinFeels = parseFloat(tomorrowsData.feels_like.day);
        displayTemperatures(tempKelvin, tempKelvinMax, tempKelvinMin, tempKelvinFeels, "tomorrow");

        /* Display humidity and wind speed */
        const humidity = tomorrowsData.humidity;
        const windSpeed = tomorrowsData.wind_speed;
        const windDirection = getWindDirection(parseInt(tomorrowsData.wind_deg));
        $("#tomorrow-humidity").html(`${humidity}%`);
        $("#tomorrow-wind-speed").html(`${windSpeed} mph ${windDirection}`);

        /* Display UVI */
        const uvIndex = parseInt(tomorrowsData.uvi);
        displayUVI(uvIndex, "tomorrow");
        getCardData(response);
    })
}

const getCardData = (response) => {
    var dataArray = [];

    for (let i = 0; i < 5; i++) {
        /* Get next Days */
        var dailyObj = {};
        dailyData = response.daily;

        // Get date
        const dt = dailyData[i].dt;
        const d = new Date(dt * 1000);
        dailyObj.date = formatDate(d, "tomorrow");
        // Get main, icon, description
        dailyObj.main = dailyData[i].weather[0].main;
        const iconCode = dailyData[i].weather[0].icon;
        dailyObj.icon_url = "http://openweathermap.org/img/wn/" + iconCode + ".png";
        dailyObj.description = dailyData[i].weather[0].description;

        // Get day and night temps
        dailyObj.temp_day = dailyData[i].temp.day;
        dailyObj.temp_night = dailyData[i].temp.night;

        // Get humidity, wind, wind direction, and uvi
        dailyObj.humidity = dailyData[i].humidity;
        dailyObj.wind_speed = dailyData[i].wind_speed
        const windDeg = dailyData[i].wind_deg;
        dailyObj.wind_direction = getWindDirection(windDeg);
        dailyObj.uvi = dailyData[i].uvi;
        dataArray.push(dailyObj);
    }
    console.log(dataArray);
    displayCards(dataArray);
}

const getUVIndexData = (responseCurrent) => {
    /* UV  days data  */
    const lon = responseCurrent.coord.lon;
    const lat = responseCurrent.coord.lat;
    const UV_QUERY_URL = `https://api.openweathermap.org/data/2.5/uvi?appid=${OW_API_KEY}&lat=${lat}&lon=${lon}`;
    $.ajax({
        url: UV_QUERY_URL,
        method: "GET"
    }).then(function (response) {
        const uvIndex = parseInt(response.value);
        displayUVI(uvIndex, "current");
    })
}

// TODO: make this return just alert
const displayUVI = (uvi, timeline) => {
    /* Determine uv risk and display results*/
    if (uvi < 3) {
        $(`#${timeline}-uv-index`).html(`${uvi} <span class="badge badge-success">Low</span>`);
    } else if (uvi <= 5) {
        $("#current-uv-index").html(`${uvi} <span class="badge badge-warning">Moderate</span>`);
    } else if (uvi <= 7) {
        $(`#${timeline}-uv-index`).html(`${uvi} <span class="badge badge-danger">High</span>`);
    } else if (uvi <= 10) {
        $(`#${timeline}-uv-index`).html(`${uvi} <span class="badge badge-danger">Very High</span>`);
    } else if (uvi >= 11) {
        $(`#${timeline}-uv-index`).html(`${uvi} <span class="badge badge-danger">Extreme</span>`);
    }
}

const getUVIAlert = (uvi) => {
    /* Determine uv risk and display results*/
    if (uvi < 3) {
        return `<span class="badge badge-success">Low</span>`
    } else if (uvi <= 5) {
        return `<span class="badge badge-warning">Moderate</span>`
    } else if (uvi <= 7) {
        return `<span class="badge badge-danger">High</span>`
    } else if (uvi <= 10) {
        return `<span class="badge badge-danger">Very High</span>`
    } else if (uvi >= 11) {
        return `<span class="badge badge-danger">Extreme</span>`
    }
}

const displayIcon = (data, timeline) => {
    /* Display weather icon and description */
    const iconCode = data.weather[0].icon;
    const main = data.weather[0].main;
    const description = data.weather[0].description;
    const iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
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

/*######## Additional function ########*/

// Format Date function
const formatDate = (d, timeline) => {
    'use strict';
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
    return formatted;
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

/* Determine wind degree */
const getWindDirection = (degree) => {

    // Round degree to the nearest tenth
    var decimalDegree = degree / 10;
    var roundDegree = Math.round(decimalDegree) * 10;

    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW",
        "W", "WNW", "NW", "NNW"];
    if ((roundDegree >= 0 && roundDegree <= 10) || (roundDegree >= 350 && roundDegree <= 360)) {
        return directions[0];
    } else if (roundDegree >= 20 && roundDegree <= 30) {
        return directions[1];
    } else if (roundDegree >= 40 && roundDegree <= 50) {
        return directions[2];
    } else if (roundDegree >= 60 && roundDegree <= 70) {
        return directions[3];
    } else if (roundDegree >= 80 && roundDegree <= 100) {
        return directions[4];
    } else if (roundDegree >= 110 && roundDegree <= 120) {
        return directions[5];
    } else if (roundDegree >= 130 && roundDegree <= 140) {
        return directions[6];
    } else if (roundDegree >= 150 && roundDegree <= 160) {
        return directions[7];
    } else if (roundDegree >= 170 && roundDegree <= 190) {
        return directions[8];
    } else if (roundDegree >= 200 && roundDegree <= 210) {
        return directions[9];
    } else if (roundDegree >= 220 && roundDegree <= 230) {
        return directions[10];
    } else if (roundDegree >= 240 && roundDegree <= 250) {
        return directions[11];
    } else if (roundDegree >= 260 && roundDegree <= 280) {
        return directions[12];
    } else if (roundDegree >= 290 && roundDegree <= 300) {
        return directions[13];
    } else if (roundDegree >= 310 && roundDegree <= 320) {
        return directions[14];
    } else if (roundDegree >= 330 && roundDegree <= 340) {
        return directions[15];
    }
}