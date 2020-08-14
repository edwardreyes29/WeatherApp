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
                <div id="${timeline}-humidity">Humidity: --%</div>
                <div id="${timeline}-wind-speed">Wind Speed: -- MPH</div>
                <div id="${timeline}-uv-index">UV Index: --</div>
            </div>
        </div>
    `)
}
/* Display weather panes for current day and tomorrow*/
displayWeatherPane("current");
displayWeatherPane("tomorrow");

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
cityName = "Paris";

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
            getUVIndexData(response);

            // Display Tomorrow's weather
            displayTomorrowWeather(response);
        });
}

displayCurrentWeather(cityName);

const displayTomorrowWeather = (response) => {
    /* UV 8 days data  */
    const lon = response.coord.lon;
    const lat = response.coord.lat;
    const UV_QUERY_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OW_API_KEY}`;

    $.ajax({
        url: UV_QUERY_URL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        const tomorrowsData = response.daily[1];
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

        /* Display humidity and wind speed */
        const humidity = tomorrowsData.humidity;
        const windSpeed = tomorrowsData.wind_speed;
        $("#tomorrow-humidity").html(`Humidity: <span class="font-weight-bold">${humidity}%</span>`);
        $("#tomorrow-wind-speed").html(`Wind Speed: <span class="font-weight-bold">${windSpeed} MPH </span>`);

        /* Display UVI */
        const uvIndex = parseInt(tomorrowsData.uvi);
        displayUVI(uvIndex, "tomorrow");
        displayCards();
    })
}

/* create card elements for bootstrap accordion */
const displayCards = () => {
    for (let i = 0; i < 6; i++) {
        $(".accordion").append(`
            <div class="card">
            <div class="card-header" id="headingOne">
                <h2 class="mb-0">
                    <button class="btn btn-link btn-block text-left" type="button"
                        data-toggle="collapse" data-target="#collapseOne" aria-expanded="true"
                        aria-controls="collapseOne">
                        Card-${i+1}
                    </button>
                </h2>
            </div>
            <div id="collapseOne" class="collapse" aria-labelledby="headingOne"
                data-parent="#accordionExample">
                <div class="card-body">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                    aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
                    Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente
                    ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer
                    farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them
                    accusamus labore sustainable VHS.
                </div>
            </div>
            </div>
        `)
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

const displayUVI = (uvi, timeline) => {
    /* Determine uv risk and display results*/
    if (uvi < 3) {
        $(`#${timeline}-uv-index`).html(`UV Index: <span class="font-weight-bold">${uvi}</span> <span class="badge badge-success">Low</span>`);
    } else if (uvi <= 5) {
        $("#current-uv-index").html(`UV Index: <span class="font-weight-bold">${uvi}</span> <span class="badge badge-warning">Moderate</span>`);
    } else if (uvi <= 7) {
        $(`#${timeline}-uv-index`).html(`UV Index: <span class="font-weight-bold">${uvi}</span> <span class="badge badge-danger">High</span>`);
    } else if (uvi <= 10) {
        $(`#${timeline}-uv-index`).html(`UV Index: <span class="font-weight-bold">${uvi}</span> <span class="badge badge-danger">Very High</span>`);
    } else if (uvi >= 11) {
        $(`#${timeline}-uv-index`).html(`UV Index: <span class="font-weight-bold">${uvi}</span> <span class="badge badge-danger">Extreme</span>`);
    }
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
