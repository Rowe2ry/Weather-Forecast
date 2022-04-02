/* =========================================================================
 * GRAB DOM ELEMENTS FOR REFERENCE
 * ========================================================================= */

var mainDivEl = document.querySelector(".row"); 

/* =========================================================================
 * DECLARE &/OR ASSIGN GLOBAL SCOPE VARIABLE
 * ========================================================================= */

var APIkey = '00d31542c0f530cb4f115dab6831ce15';
var iconURLpt1 = 'http://openweathermap.org/img/wn/';
var iconURLpt2 = '@2x.png'
var city = "atlanta";
var state;

// I know global variables aren't great, but I was having trouble defining a global variable that  would hold the fetch response as an object
var curCityName;
var curCityDateTime;
var curCityIconCode;
var curCityIconURL;
var curCityCond;
var curCityTemp;
var curCityHumid;
var curCityWind;
var curCityUV;


/* =========================================================================
 * FUNCTION DEFINITIONS
 * ========================================================================= */

// the API call I should have been using......
/* fetch('https://api.openweathermap.org/data/2.5/onecall?' + 'lat=33.44&lon=-94' + '.04&exclude=hourly,minutely,alerts&units=imperialappid=' + APIkey)*/


// grab one day weather data from OpenWeather by city name
function rightNowWeather(location) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + location + '&units=imperial&appid=' + APIkey).then( function (response){
        if (response.ok) {
            response.json().then(function (data) {
            console.log(data);
            curCityName = data.name; // name as string
            console.log("The city's name is :" + curCityName);
            curCityDateTime = moment(data.dt, 'X').format('llll'); // day and time
            console.log('Date and time are: ' + curCityDateTime);
            curCityIconCode = data.weather[0].icon; // 3 digit code
            curCityIconURL = iconURLpt1 + curCityIconCode + iconURLpt2;
            var imageForCurrent = document.createElement('img');
            imageForCurrent.setAttribute('src', curCityIconURL);
            imageForCurrent.setAttribute('alt', 'Icon showing weather conditions code: ' + curCityIconCode);
            mainDivEl.append(imageForCurrent);
            curCityCond = data.weather[0].description; // ex. "clear skies"
            console.log('the current conditions are: ' + curCityCond);
            curCityTemp = data.main.temp; // °F
            console.log('It is currently ' + curCityTemp + '°F');
            curCityHumid = data.main.humidity; // %
            console.log('with ' + curCityHumid + '% humidity');
            curCityWind = data.wind.speed; // mph
            console.log('wind speeds of ' + curCityWind + ' miles/hour')
            //curCityUV = data.;
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
