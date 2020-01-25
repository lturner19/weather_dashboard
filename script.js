const apiKey = "&appid=1b5bd969040dfbf14940a6cc061c29a4";
const city = [];
const weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + apiKey;
const forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + apiKey;
const uviURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid={appid}&lat={lat}&lon={lon}&cnt={cnt}"
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
    /* for (let index = 0; index < city.length; index++) {
        const citySearch = city[index];
 */
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {


        // Creating a div to hold the city
        var cityHeading = $("<h3 class='city'>");

        cityDiv.html(city[index]);

        var pOne = $("<p class='temperature'>");

        pOne.html("Temperature:  " + response.main.temp + "°F");
        var tempF = (response.main.temp - 273.15) * 1.80 + 32)

    var pTwo = $("<p class='humidity'>");

    pTwo.html("Humidity:  " + response.main.humidity + "%");

    var pThree = $("<p class='wind-speed'>");

    pThree.html("Wind Speed  " + response.wind.speed + "mpg");

    var pfour = $("<p class='uv'>");




    /*   // Creating an element to have the rating displayed
      var pOne = $("<p>").text("Rating: " + rating);
 
      // Displaying the rating
      movieDiv.append(pOne); */

})
})
