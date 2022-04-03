/* =========================================================================
 * GRAB DOM ELEMENTS FOR REFERENCE
 * ========================================================================= */

var mainDivEl = document.querySelector(".row"); 

/* =========================================================================
 * DECLARE &/OR ASSIGN GLOBAL SCOPE VARIABLE
 * ========================================================================= */

var APIkeyCurrent = '00d31542c0f530cb4f115dab6831ce15';
var APIkeyFiveDay = 'd2615aa0825538ecfc67550581ba6a13';

/* var iconURL = 'http://openweathermap.org/img/wn/' +
    iconCode +
    '@2x.png'; */

var city = "atlanta";

// I know global variables aren't great, but I was having trouble defining a global variable that  would hold the fetch response as an object


/* =========================================================================
 * FUNCTION DEFINITIONS
 * ========================================================================= */

// TODO: the API call I should have been using......
/* fetch('https://api.openweathermap.org/data/2.5/onecall?' + 'lat=33.44&lon=-94' + '.04&exclude=hourly,minutely,alerts&units=imperialappid=' + APIkey)*/


// grab one day weather data from OpenWeather by city name
function rightNowWeather(location) {
    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + 
    location + 
    '&units=imperial&appid=' +
    APIkeyCurrent;

    fetch(currentWeatherURL)
        .then(function (response){
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        // console.log(data);
                        var nowName = data.name; // string --- index 0
                        var latitude = data.coord.lat;
                        latitude = latitude.toFixed(2); // number --- index 1
                        var longitude = data.coord.lon;
                        longitude = longitude.toFixed(2);// number --- index 2
                        var nowDataRelevant = [
                            nowName, latitude, longitude
                        ];
                        fiveDayForecastWeather(nowDataRelevant);
                    });
            } else {
                console.log('error friend');
            };
        });
};

function fiveDayForecastWeather(arr) {
    var fiveDayForecastURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' +
    arr[1] + '&lon=' + arr[2] + '&exclude=minutely,hourly,alerts&units=imperial&appid=' +
    APIkeyFiveDay;

    fetch(fiveDayForecastURL)
        .then(function (response){
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        // console.log(data);
                        var cityName = arr[0];
                        var fiveDayRelevantdata = [];
                        for (i = 0; i < 6; i++) {
                            var objectDay = {
                                city: cityName,
                                day: "day " + (i),
                                date: moment(data.daily[i].dt, 'X').format('l'),
                                weekday: moment(data.daily[i].dt, 'X').format('dddd'),
                                icon: data.daily[i].weather[0].icon,
                                temp: data.daily[i].temp.day,
                                wind: data.daily[i].wind_speed,
                                humid: data.daily[i].humidity,
                                uvIndex: data.daily[0].uvi
                            };
                            fiveDayRelevantdata.push(objectDay);
                        }
                        console.log('6 days of relevant data here hopefully');
                        console.log(fiveDayRelevantdata);
                    });
                } else {
                    console.log('error friend');
                };
        });
    
};

/* =========================================================================
 * ACTIVE EVENT LISTENERS
 * ========================================================================= */

/* =========================================================================
 * ACTUAL PAGE LOAD LOGIC AND FUNCTION EXECUTION
 * ========================================================================= */



rightNowWeather(city);
