/* =========================================================================
 * GRAB DOM ELEMENTS FOR REFERENCE
 * ========================================================================= */

/* =========================================================================
 * DECLARE &/OR ASSIGN GLOBAL SCOPE VARIABLE
 * ========================================================================= */

var APIkey = '00d31542c0f530cb4f115dab6831ce15';
var city = "atlanta";
var state;


/* =========================================================================
 * FUNCTION DEFINITIONS
 * ========================================================================= */

/* =========================================================================
 * ACTIVE EVENT LISTENERS
 * ========================================================================= */

/* =========================================================================
 * ACTUAL PAGE LOAD LOGIC AND FUNCTION EXECUTION
 * ========================================================================= */

// grab one day weather data from OpenWeather by city name
fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIkey).then( function (response){
    if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
        });
    } else {
        console.log('error friend');
    };
});