$(document).ready(function () {

    //global variables
    const apiKey = "appid=1b5bd969040dfbf14940a6cc061c29a4";
    let city = [];
    let index = 0;
    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?" + apiKey + "&q=";
    let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?" + apiKey + "&q=";
    let uviURL = "https://api.openweathermap.org/data/2.5/uvi?" + apiKey;


    $(document).on("click", "li", function () {//in future give li's a class so that the document will only grab those specific ones
        displayWeather($(this).text().trim());
    });


    $("button").click(function displayCities() {
        //takes the value of the entered in search box and trims the whitespace
        let cityInput = $("#user-input").val().trim();

        //calls the weather function and applies cityInput as parameter
        displayWeather(cityInput);

        if (cityInput === "") {
            alert("Please enter a city name");
        }
        //displays cities under search box
        var ul = $("<ul>");
        var li = $("<li>");
        li.append(cityInput);
        ul.append(li);
        $(".city-input").append(ul);
        storeCities(cityInput);
    })

    //---------------------------------------------------------------------------------------------------------------------------
    function displayWeather(city) {
        //setting weatherURL to variable and then attaching the city the user entered.
        let url = weatherURL.concat(city);

        $.ajax({
            url: url,
            method: "GET"
        }).then(function (response) {

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1st ajax call~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            //dynamically creating h3 tag and then applying the city name from the api
            var cityHeading = $("<h3 class='user-city'>");
            cityHeading.append(response.name);

            var date = $("<span>") //creates a span to display the date next to the city
            date.html(" " + moment(response.dt, "X").format("MM/DD/YYYY"));//converting the dt from a number to a string, then back to a number

            var img = "<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' >" //displays the weather icon for the day

            cityHeading.append(date, img); //display city name with date and weather icon

            const pOne = $("<p class='temperature'>");
            let tempF = (Math.floor((response.main.temp - 273.15) * 1.80) + 32); //converts temp from celsius to fahrenheit
            pOne.html("Temperature:   " + tempF + "°F");//degree symbol = alt + 0176


            const pTwo = $("<p class='humidity'>");
            pTwo.html("Humidity:   " + response.main.humidity + "%");

            const pThree = $("<p class='wind-speed'>");
            let wind = response.wind.speed;
            pThree.html("Wind Speed:   " + wind + " mph");

            //adds forecast api with the city input by the user 


            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~2nd ajax call~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            let url = forecastURL.concat(city);

            //calling forecast api to get coordinates for uv index
            $.ajax({
                url: url,
                method: "GET"
            }).then(function (data) {

                //coordinates called from the forecast api
                let longitude = data.city.coord.lon
                let latitude = data.city.coord.lat
                var row = $("<div class='row' id='second-row'>");
                var colOne = $("<div class='col1'>");

                //empty variables to hold 5 day forecast info from api list array
                var colTwo;
                var colThree;
                var colFour;
                var colFive;

                // running through array from forecast api
                for (let index = 1; index < data.list.length; index++) {

                    //grabs the weather info at 9 for each of the 5 days
                    if (data.list[index].dt_txt.indexOf("00:00:00") > -1) {

                        colOne = $("<div class='col-sm-2'>"); //keeps the columns in a row
                        colOne.append(moment(data.list[index].dt, "X").format("MM/DD/YYYY"));
                        var img = "<img src='https://openweathermap.org/img/w/" + data.list[index].weather[0].icon + ".png' >"

                        var pTagOne = $("<p class='ptemp'>")
                        let tempConversion = (Math.floor((data.list[index].main.temp - 273.15) * 1.80) + 32);
                        pTagOne.html("Temp:   " + tempConversion + "°F");

                        var pTagTwo = $("<p class='humid'>");
                        pTagTwo.html("Humidity:   " + data.list[index].main.humidity + " %");


                        colOne.append(img, pTagOne, pTagTwo);
                        row.append(colOne);
                        //keeps the five day forecast empty, ensures the forecast for new city is not appended to past city
                        $("#five-day").empty("");
                    }
                }
                //allows all the info gathered to be displayed on page
                $("#five-day").append(row);

                //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~3rd ajax call~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

                //Calling uv index with long. and lat. coordinates
                $.ajax({
                    url: uviURL + "&lat=" + latitude + "&lon=" + longitude,
                    method: "GET"
                }).then(function (data) {

                    //colors the uv index based on the current value 
                    var pFour = $("<p class='uvi'>");
                    var uv = data.value

                    if (uv <= 2) {
                        pFour = $("<p class='ok'>");
                    } else if (uv > 3 && uv <= 5) {
                        pFour = $("<p class='moderate'>");
                    } else if (uv > 6 && uv <= 7) {
                        pFour = $("<p class='warning'>");
                    } else if (uv > 8 && uv <= 10) {
                        pFour = $("<p class='danger'>");
                    } else {
                        pFour = $("<p class='extreme'>");
                    }

                    pFour.append("UV Index:   ")
                    pFour.append(data.value);

                    //creates an empty div tag, does not show new city + previous city's info
                    $("#city-info").empty();
                    $("#city-info").append(cityHeading, pOne, pTwo, pThree, pFour);
                })
            })
        });
    }
    //-------------------------------------------------------------------------------------------------------------------
    function storeCities(cityInput) {
        //retrieves city input from local storage
        var cityArray = JSON.parse(localStorage.getItem("cityArray")) || [];

        //validation to stop duplicate city inputs from being stored in local storage
        if (!cityArray.includes(cityInput)) {
            cityArray.push(cityInput);
            localStorage.setItem("cityArray", JSON.stringify(cityArray));
        }
    }

    function retrieveCities() {
        //retrieves city input from local storage; then is used to display city info under the search box
        var cityArray = JSON.parse(localStorage.getItem("cityArray")) || [];

        var ul = $("<ul>");// put here so as not to keep creating ul tags
        for (var index = 0; index < cityArray.length; index++) {
            var li = $("<li>");
            li.append(cityArray[index]);
            ul.append(li);
            $(".city-input").append(ul);
        }

        if (cityArray.length > 0) { //displays the last city entered, even after refresh
            displayWeather(cityArray[cityArray.length - 1]);
        }
    }
    //---------------------------------------------------------------------------------------------------------------------
    retrieveCities();

    $("#clear").click(function () {
        localStorage.clear();
    });

});