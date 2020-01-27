const apiKey = "appid=1b5bd969040dfbf14940a6cc061c29a4";
let city = [];
let index = 0;
let weatherURL = "https://api.openweathermap.org/data/2.5/weather?" + apiKey + "&q=";
let forecastURL = "http://api.openweathermap.org/data/2.5/forecast?" + apiKey + "&q=";
let uviURL = "http://api.openweathermap.org/data/2.5/uvi?" + apiKey;



$(document).on("click", ".listnone", displayWeather);

var storedCities = localStorage.getItem("city");
if (storedCities !== null) {
    var cityArr = JSON.parse(storedCities);
    if (cityArr.length >= 0) {
        for (index = 0; index < cityArr.length; index++) {
            var ul = $("<ul>").attr("class", "listnone");
            var li = $("<li>");
            li.append(cityArr[index]);
            ul.append(li);
            $("#user-input").append(ul);
        }
    }
}


$("button").on("click", function () {
    const cityInput = $("#user-input").val().trim(); //grabs the user's city input
    city.push(cityInput);
    let storeCities = localStorage.setItem("city", JSON.stringify(city));
    displayWeather(cityInput);

    if (cityInput === "") {
        alert("Please enter a city name.");
    }
    var ul = $("<ul>").attr("class", "listnone");
    var li = $("<li>");
    li.append(cityInput);
    ul.append(li);
    $(".cityList").prepend(ul);
    localStorage.getItem("cityArr", cityArr);

    weatherURL = weatherURL.concat(city)
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
        date.html(" " + moment(response.dt, "X").format("MM/DD/YYYY"));//converting the dt from a number to a string, then back to a number
        cityHeading.append(date);

        const pOne = $("<p class='temperature'>");
        let tempF = (Math.floor((response.main.temp - 273.15) * 1.80) + 32);
        pOne.html("Temperature:   " + tempF + "°F");


        const pTwo = $("<p class='humidity'>");
        pTwo.html("Humidity:   " + response.main.humidity + "%");

        const pThree = $("<p class='wind-speed'>");
        pThree.html("Wind Speed:   " + response.wind.speed + "mph");


        forecastURL = forecastURL.concat(city);

        //calling forecast api to get coordinates for uv index
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (data) {

            let longitude = data.city.coord.lon
            let latitude = data.city.coord.lat
            var row = $("<div class='row' id='second-row'>");
            var colOne = $("<div class='col1'>");

            //empty variables to hold 5 day forecast info from api list array
            var colTwo;
            var colThree;
            var colFour;
            var colFive;


            for (let index = 1; index < data.list.length; index++) {//array from forecast api

                if (data.list[index].dt_txt.indexOf("00:00:00") > -1) {//grabs the weather info at midnight for each of the 5 days
                    colOne = $("<div class='col-sm-2'>"); //keeps the columns in a row
                    colOne.append(moment(data.list[index].dt, "X").format("MM/DD/YYYY"));
                    var img = "<img src='http://openweathermap.org/img/w/" + data.list[index].weather[0].icon + ".png' >"

                    var pTagOne = $("<p class='ptemp'>")
                    let tempConversion = (Math.floor((data.list[index].main.temp - 273.15) * 1.80) + 32);
                    pTagOne.html("Temp:   " + tempConversion + "°F");

                    var pTagTwo = $("<p class='humid'>");
                    pTagTwo.html("Humidity:   " + data.list[index].main.humidity + " %");
                    colOne.append(img, pTagOne, pTagTwo);
                    row.append(colOne);
                }
            }
            $("#five-day").append(row);

            //Calling uv index with long. and lat. coordinates
            $.ajax({
                url: uviURL + "&lat=" + latitude + "&lon=" + longitude,
                method: "GET"
            }).then(function (data) {

                var pFour = $("<p class='uvi'>");
                if (data.value <= 3) {
                    pFour = $("<p class='ok'>");
                } else if (data.value > 3 && data.value < 7) {
                    pFour = $("<p class='warning'>");
                } else {
                    pFour = $("<p class='danger'>");
                }
                pFour.append("UV Index:   ")
                pFour.append(data.value);
                $("#city-info").append(cityHeading, pOne, pTwo, pThree, pFour)
            })
        })
    });
}
