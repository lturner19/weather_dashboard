const apiKey = "appid=1b5bd969040dfbf14940a6cc061c29a4";
const city = [];
let weatherURL = "https://api.openweathermap.org/data/2.5/weather?" + apiKey + "&q=";
let forecastURL = "http://api.openweathermap.org/data/2.5/forecast?" + apiKey + "&q=";
let uviURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?" + apiKey + ///
    apiKey;
let currentDate = moment().format('LL');

/* <div class="card" style="width: 30%;">
<div class="card-body" id="search">
    <h5>Search for a City:</h5>
    <input label="search" />
    <button><i class="fas fa-search"></i></button>
</div>
</div>

<div class="card" style="width: 30%;">
<div class="card-body" id="city-info">
<h3>Atlanta</h3>
<p>Temperature</p>
<p>Humidity
<p>Wind Speed</p>
<p>UV Index</p>
</div>
</div>
<div class="card" style="width: 30%;">
<div class="card-body" id="five-day">
<h5>5-Day Forecast:</h5>
</div>
</div> */
console.log(currentDate);

$("button").on("click", function () {
    const cityInput = $("#user-input").val().trim() //grabs the users city input
    displayWeather(cityInput);
    //can put validation here to handle when user does not put a response
});

function displayWeather(city) {

    weatherURL = weatherURL.concat(city);

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {


        // Creating a div to hold the city
        var cityHeading = $("<h3 class='city'>");

        cityDiv.html(city[index]);

        var pOne = $("<p class='temperature'>");

        pOne.html("Temperature:  " + response.main.temp + "°F");
        var tempF = ((response.main.temp - 273.15) * 1.80) + 32;

        var pTwo = $("<p class='humidity'>");

        pTwo.html("Humidity:  " + response.main.humidity + "%");

        var pThree = $("<p class='wind-speed'>");

        pThree.html("Wind Speed  " + response.wind.speed + "mpg");

        var pfour = $("<p class='uv'>");//put 2nd call back for uv w/in this function


    });
}


