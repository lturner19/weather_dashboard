const apiKey = "appid=1b5bd969040dfbf14940a6cc061c29a4";
let city = [];
let weatherURL = "https://api.openweathermap.org/data/2.5/weather?" + apiKey + "&q=";
let forecastURL = "http://api.openweathermap.org/data/2.5/forecast?" + apiKey + "&q=";
let uviURL = "http://api.openweathermap.org/data/2.5/uvi?" + apiKey;


/* <header>
<h1>Weather Dashboard</h1>
</header>
<div class="container">
<div class="row" id="weather-info">
    <div class="col-sm-4">
        <div class="card" style="width: 80%;">
            <div class="card-body" id="search">
                <h5>Search for City:</h5>
                <input label="search" id="user-input" />
                <button><i class="fas fa-search"></i></button>
            </div>
        </div>
    </div>
    <div class="col-sm-8">
        <div class="card" style="width: 100%;">
            <div class="card-body" id="city-info">

            </div>
        </div>
        <div id="five-day"></div>
    </div>

</div>
</div>

<footer>
Created by: lturner19
</footer>
 */


$("button").on("click", function () {
    const cityInput = $("#user-input").val().trim(); //grabs the user's city input
    displayWeather(cityInput);
    //can put validation here to handle when user does not put a response
});

function displayWeather(city) {

    weatherURL = weatherURL.concat(city);

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {

        var cityHeading = $("<h3 class='user-city'>");

        cityHeading.append(response.name);

        var date = $("<span>")
        date.html(" " + moment(response.dt, "X").format("MM/DD/YYYY"));
        cityHeading.append(date);

        const pOne = $("<p class='temperature'>");
        let tempF = (Math.floor((response.main.temp - 273.15) * 1.80) + 32);
        pOne.html("Temperature:   " + tempF + "°F");


        const pTwo = $("<p class='humidity'>");
        pTwo.html("Humidity:   " + response.main.humidity + "%");

        const pThree = $("<p class='wind-speed'>");
        pThree.html("Wind Speed:   " + response.wind.speed + "mph");

        //put 2nd call back for uv w/in this function



        forecastURL = forecastURL.concat(city);

        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (data) {

            let longitude = data.city.coord.lon
            let latitude = data.city.coord.lat
            var row =$("<div class='row'>");
            var colOne = $("<div class='col1'>");
        //colOne.html(data.)
        var colTwo;
        var colThree;
        var colFour;
        var colFive;


for (let index = 0; index < data.list.length; index++) {

       if(data.list[index].dt_txt.indexOf("00:00:00") > -1 ){
        colOne = $("<div class='col-sm-2'>");
        colOne.append(moment(data.list[index].dt,"X").format("MM/DD/YYYY"));
        var img = "<img src='http://openweathermap.org/img/w/"+ data.list[index].weather[0].icon+  ".png' >"
       colOne.append(img)
       
       var p = $("<p class='ptemp'>")
       p.html("Temperature   " +data.list[index].main.temp)

       colOne.append(p);
        row.append(colOne);       
       }
    }
         
       $("#five-day").append(row);  
         
            $.ajax({
                url: uviURL + "&lat=" + latitude + "&lon=" + longitude,
                method: "GET"
            }).then(function (data) {

                var pFour = $("<p class='uvi'>");

                pFour.html("UV Index   " + data.value);

                $("#city-info").append(cityHeading, pOne, pTwo, pThree, pFour)
                
              

            })

        })

        //need to display the forecast for the next 5 days
        //need dates, temperature, icon, humidity

    });

}
