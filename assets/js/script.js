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

var cityName = "atlanta";

// I know global variables aren't great, but I was having trouble defining a global variable that  would hold the fetch response as an object


/* =========================================================================
 * FUNCTION DEFINITIONS
 * ========================================================================= */

// TODO: the API call I should have been using......
/* fetch('https://api.openweathermap.org/data/2.5/onecall?' + 'lat=33.44&lon=-94' + '.04&exclude=hourly,minutely,alerts&units=imperialappid=' + APIkey)*/


// grab one day weather data from OpenWeather by city name
function rightNowWeather(location) {
    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + 
    cityName +
    '&units=imperial&appid=' +
    APIkeyCurrent;

    fetch(currentWeatherURL)
        .then(function (response){
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        // console.log(data);
                        var nowName = data.name; // string --- index 0
                        var nowDate =  moment(data.dt, 'X').format('l'); // UNIX time to string DD/DD/YYYY --- index 1
                        var nowIcon = data.weather[0].icon; // icon code 3 digit string --- index 2
                        var nowTemp = data.main.temp; // °F --- index 3
                        var nowHumid = data.main.humidity; // humidity in % --- index 4
                        var nowWind = data.wind.speed; // wind speed in mp/h --- index 5
                        var latitude = data.coord.lat;
                        latitude = latitude.toFixed(2); // number --- index 6
                        var longitude = data.coord.lon;
                        longitude = longitude.toFixed(2);// number --- index 7
                        var nowDataRelevant = [
                            nowName, nowDate, nowIcon, nowTemp, nowHumid, nowWind, latitude, longitude
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
    arr[6] + '&lon=' + arr[7] + '&exclude=minutely,hourly,alerts&units=imperial&appid=' +
    APIkeyFiveDay;

    fetch(fiveDayForecastURL)
        .then(function (response){
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        // console.log(data);
                        var uvIndex = data.daily[0].uvi;
                        var nowDataRelevant = arr;
                        nowDataRelevant.push(uvIndex);
                        console.log ('relevant data for current conditions should be 9 things');
                        console.log(nowDataRelevant);
                        //populateCurrentWeather(nowDataRelevant);
                        var fiveDayRelevantdata = [];
                        for (i = 1; i < 6; i++) {
                            var objectDay = {
                                name: "day " + (i),
                                date: moment(data.daily[i].dt, 'X').format('l'),
                                icon: data.daily[i].weather[0].icon,
                                temp: data.daily[i].temp.day,
                                wind: data.daily[i].wind_speed,
                                humid: data.daily[i].humidity,
                            };
                            fiveDayRelevantdata.push(objectDay);
                        }
                        console.log('5 days ofrelevant data here hopefully');
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



rightNowWeather(cityName);
