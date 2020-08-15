// TODO: add styling to change background dynamically based on time of day
var searchedLocations = [];

/* render search history */
const renderSearchHistory = () => {
    for (let i = 0; i < searchedLocations.length; i++) {
        $(`#search-dropdown-history`).append(`
            <button class="dropdown-item btn" type="button" data-location="${searchedLocations[i]}">${searchedLocations[i]}</button>
        `);
    }
}

/* initialize searchedLocations with local storage data */
const init = () => {
    var storedLocations = JSON.parse(localStorage.getItem("searchedLocations"));
    if (storedLocations !== null) {
        for (var i = 0; i < storedLocations.length; i++) {
            searchedLocations.push(storedLocations[i]);
        }
    }
    // Render todos to the DOM
    // renderTodos();
    if (searchedLocations.length > 0) {
        renderSearchHistory();
    }
}
init();


/* store searched locations to local storage */
var storeLocations = () => {
    console.log("in store")
    localStorage.setItem("searchedLocations", JSON.stringify(searchedLocations));
}


/*######## HTML interactivity ########*/
/* Displays the weather panes */
var displayWeatherPane = (timeline) => {
    $(`#${timeline}`).append(`
        <h2 class="city-name" class="w-100">Location</h2>
        <p id="${timeline}-date">Date</p>
        <div id="${timeline}-temp-container w-100" class="row">
            <div class="col-7 d-flex p-0">
                <div class="w-100 pl-3">
                    <p id="${timeline}-min-max" class="align-self-center m-0">
                        <span id="${timeline}-min" class="fahr-display">min: 0</span>
                        <img src="assets/icons/dot.svg">
                        <span id="${timeline}-max" class="fahr-display">max: 0</span>
                    </p>
                    <div class="w-100">
                        <h3 id="${timeline}-temp" class="align-self-center m-0 fahr-display"
                            style="font-size:4rem;">0</h3>
                    </div>
                    <p id="${timeline}-feels" class="fahr-display" class="align-self-center m-0">Feels like 0
                    </p>
                </div>

            </div>
            <div id="${timeline}-weather-container" class="col-5">
                <div>
                    <img src="" id="${timeline}-icon" class="img-fluid">
                    <p id="${timeline}-main" class="m-0"></p>
                    <p id="${timeline}-description" class="m-0" style="font-size: x-small"></p>
                </div>
            </div>
            <div id="${timeline}-info-container" class="pl-3 w-100">
                <div class="row w-100">
                    <div class="col-7">
                        <div>Humidity:</div>
                        <div>Wind:</div>
                        <div>UV index:</div>
                    </div>
                    <div class="col-5">
                        <div id="${timeline}-humidity">0%</div>
                        <div id="${timeline}-wind-speed">0 mph N</div>
                        <div id="${timeline}-uv-index">0</div>
                    </div>
                </div>
            </div>
        </div>
    `)
}

/* create card elements for bootstrap accordion */
var displayCards = () => {
    console.log("display cards")
    for (let i = 0; i < 5; i++) {
        console.log("inside")
        $(".accordion").append(`
        <div class="card">
        <div class="card-header" id="headingOne">
            <h2 class="mb-0">
                <div class="d-flex">
                <button class="btn btn-block text-left pl-0" type="button"
                    data-toggle="collapse" data-target="#collapse-${i + 1}" aria-expanded="true"
                    aria-controls="collapse-${i + 1}"><span id="daily-date-${i + 1}">Date</span>
                    <p id="daily-description-${i + 1}" class="m-0 text-secondary" style="font-size:0.9rem;">Description</p>
                </button>
                    <img id="daily-icon-${i + 1}" src=""></img>
                    <div class="ml-2 mb-2 mt-3 text-right">
                        <p id="daily-temp-day-${i + 1}" class="m-0 degree-display" style="font-size: 0.9rem;">100</p>
                        <p id="daily-temp-night-${i + 1}" class="m-0 degree-display text-secondary" style="font-size: 0.9rem;">90</p>
                    </div>
                </div>
            </h2>
        </div>
        <div id="collapse-${i + 1}" class="collapse" aria-labelledby="headine-${i + 1}" data-parent="#accordionExample">
            <div class="card-body">
                <div class="row w-100">
                    <div class="col-6">
                        <div class="text-secondary">Humidity:</div>
                        <div class="text-secondary">Wind:</div>
                        <div class="text-secondary">UV index:</div>
                    </div>
                    <div class="col-6">
                        <div id="daily-humidity-${i + 1}">0%</div>
                        <div id="daily-wind-${i + 1}">0 mph N</div>
                        <div id="daily-uvi-${i + 1}">0</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `)
    }
}
/* Display weather panes for current day and tomorrow*/
displayWeatherPane("current");
displayWeatherPane("tomorrow");

/* display cards */
displayCards();

/* Toggle side bar display */
$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $('.overlay').addClass('active');
});
$('#dismiss').on('click', function () {
    $('#sidebar').addClass('active');
    $('.overlay').removeClass('active');
});
/*######## Open Weather API ########*/

/* Current weather data */
const OW_API_KEY = "de36e36780976652d3e84a5502633fce";
const NUMBER_OF_DAYS = 5;
var cityName;


/* Search button to save search history*/
$("#search-button").on("click", () => {
    event.preventDefault();
    console.log($("#dropdownHistory").val());
    var cityName = $("#dropdownHistory").val().trim();

    if (cityName.length === 0 || cityName === null || cityName === undefined) {

    } else {
        displayCurrentWeather(cityName);
        $(`#search-dropdown-history`).append(`
            <button class="dropdown-item btn" type="button" data-location="${cityName}">${cityName}</button>
        `);
        searchedLocations.push(cityName);
        console.log(searchedLocations);
        // localStorage.setItem("searchedLocations", cityName);
        storeLocations();
    }
});

/* Current weather data */
var displayCurrentWeather = (cityName) => {
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

displayCurrentWeather("Los Angeles"); // Default display

var displayTomorrowWeather = (response) => {
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

/* Push data to cards*/
const getCardData = (response) => {
    for (let i = 0; i < 5; i++) {
        /* Get next Days */
        var dailyObj = {};
        dailyData = response.daily;

        // Get date
        const dt = dailyData[i + 1].dt;
        const d = new Date(dt * 1000);
        $(`#daily-date-${i + 1}`).html(formatDate(d, "tomorrow"))

        // Get main, icon, description
        const iconCode = dailyData[i].weather[0].icon;
        $(`#daily-icon-${i + 1}`).attr("src", "http://openweathermap.org/img/wn/" + iconCode + ".png");
        descriptionCapitalized = capitalize(dailyData[i].weather[0].description)
        $(`#daily-description-${i + 1}`).html(descriptionCapitalized);

        // Get day and night temps
        const dayTempConversion = parseInt(kToF(parseFloat(dailyData[i].temp.day)));
        const nightTempConversion = parseInt(kToF(parseFloat(dailyData[i].temp.night)));
        $(`#daily-temp-day-${i + 1}`).html(dayTempConversion).attr("data-temp", dailyData[i].temp.day);
        $(`#daily-temp-night-${i + 1}`).html(nightTempConversion).attr("data-temp", dailyData[i].temp.night);

        // Get humidity, wind, wind direction, and uvi
        $(`#daily-humidity-${i + 1}`).html(`${dailyData[i].humidity}%`);
        const windDeg = dailyData[i].wind_deg;
        $(`#daily-wind-${i + 1}`).html(`${dailyData[i + 1].wind_speed} mph ${getWindDirection(windDeg)}`)
        var uvi = parseInt(dailyData[i].uvi);
        $(`#daily-uvi-${i + 1}`).html(`${uvi} ${getUVIAlert(uvi)}`);
    }
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

/* On click function to display */
$(document).on("click", ".dropdown-item", function(event) {
    console.log($(this).data("location"));
    const clickedLocation = $(this).data("location");
    displayCurrentWeather(clickedLocation);
})

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

/* Capitalize string */
const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}