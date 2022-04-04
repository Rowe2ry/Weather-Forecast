/* =========================================================================
 * GRAB DOM ELEMENTS FOR REFERENCE
 * ========================================================================= */

var searchQueryInput = document.getElementById('cityName'); // text input for searching
var searchHistoryEl = document.getElementById('search-history'); // drop down list input
var searchButtonEl = document.getElementById('search-btn'); // button to initiate search

/* =========================================================================
 * DECLARE &/OR ASSIGN GLOBAL SCOPE VARIABLE
 * ========================================================================= */

var APIkeyCurrent = '00d31542c0f530cb4f115dab6831ce15'; // to call the current Weather API from Open Weather
var APIkeyFiveDay = 'd2615aa0825538ecfc67550581ba6a13'; // to call the "OneCall" API from Open Weather

/* =========================================================================
 * FUNCTION DEFINITIONS
 * ========================================================================= */

// grab one day weather data from OpenWeather by city name
function rightNowWeather(location) {
    // API url, the city is entered by the user, other string queries are the
    // Imperial units and the API key required to call from Open Weather
    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + 
    location + 
    '&units=imperial&appid=' +
    APIkeyCurrent;

    // grabs the raw data we need
    fetch(currentWeatherURL)
        .then(function (response){
            if (response.ok) {
                response.json() // format the data into a usable and mutable object
                    .then(function (data) {
                        var nowName = data.name; //  Grab the city name --- string --- index 0
                        var latitude = data.coord.lat; // Grab latitude coordinate
                        latitude = latitude.toFixed(2); // API call for 5 day forecast wants 2 decimal places --- number --- index 1
                        var longitude = data.coord.lon; // Grab longitude coordinate
                        longitude = longitude.toFixed(2);// API call for 5 day forecast wants 2 decimal places --- number --- index 2
                        var nowDataRelevant = [
                            nowName, latitude, longitude
                        ]; // just the 3 pieces of info we needed from the current Weather API call which uses a city name to search
                        fiveDayForecastWeather(nowDataRelevant);
                    });
            } else {
                console.log('error with current weather fetch | likely invalid city name'); // just some feedback if the API doesn't recognize the city name
            };
        });
};

// grab 5 day weather data from OpenWeather by coordinates obtained in
// the current weather API call
function fiveDayForecastWeather(arr) {
    // API url, the coordinates are calculated form the other API call, other string queries are the
    // Imperial units, hourly, minutely data omission, and the API key required to call from Open Weather
    var fiveDayForecastURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' +
    arr[1] + '&lon=' + arr[2] + '&exclude=minutely,hourly,alerts&units=imperial&appid=' +
    APIkeyFiveDay;

    // grabs the raw data we need
    fetch(fiveDayForecastURL)
        .then(function (response){
            if (response.ok) {
                response.json() // format the data into a usable and mutable object
                    .then(function (data) {
                        var cityName = arr[0]; // get the official city name as formatted and recognized by the API
                        var fiveDayRelevantdata = []; // empty array for storing relevant data
                        for (i = 0; i < 6; i++) { // loop populates the declared array above
                            var objectDay = {
                                city: cityName,
                                day: "day" + (i),
                                date: moment(data.daily[i].dt, 'X').format('l'), // from API's unix timestamp to MM/DD/YYYY
                                weekday: moment(data.daily[i].dt, 'X').format('dddd'), // from API's unix timestamp to a weekday string (eg. Monday)
                                icon: data.daily[i].weather[0].icon, // 3 digit icon code used to display weather conditions
                                temp: data.daily[i].temp.day +'°F', // temperature plus the Fahrenheit unit marker
                                wind: data.daily[i].wind_speed + 'mph', // wind speed and miles per hour unit marker
                                humid: data.daily[i].humidity + '%', // percent humidity - preformatted with unit
                                uvIndex: data.daily[0].uvi // UV index
                            };
                            fiveDayRelevantdata.push(objectDay); // add the object to the array
                        }
                        console.log('6 days of relevant data here'); // this sets the console for the relevant data and confirms the function is working
                        console.log(fiveDayRelevantdata); // displays the array of pure data condensed to only what is needed for the App
                        populatePage(fiveDayRelevantdata); // executes the function that plugs the data into the page's elements
                    });
                } else {
                    console.log('error with 5 day forecast fetch'); // just keeping track of potential failures
                };
        });
    
};

// a function that plugs API data into page elements
function populatePage (arr) {
    // UV index is only required from the first object in our data array (the current day)
    var pageUVindex = document.getElementById('day0-uv');
    // grade the severity of UV index on a 0 to 11+ scale and setting a class
    // on the display element that gives conditional formatting based on how
    // good or bad the UV index is
    if (arr[0].uvIndex <= 2.5) {
        pageUVindex.setAttribute('class', 'inline card-filler uvLow');
    } else if (arr[0].uvIndex > 2.5 && arr[0].uvIndex <=5.5) {
        pageUVindex.setAttribute('class', 'inline card-filler uvModerate');
    } else if (arr[0].uvIndex > 5.5 && arr[0].uvIndex <=7.5) {
        pageUVindex.setAttribute('class', 'inline card-filler uvHigh');
    } else if (arr[0].uvIndex > 7.5 && arr[0].uvIndex <=10.5) {
        pageUVindex.setAttribute('class', 'inline card-filler uvSevere');
    } else {
        pageUVindex.setAttribute('class', 'inline card-filler uvInsane');
    };
    // for loop upates text content in all placeholders with API data
    for (i = 0; i < arr.length; i++) {
        // for the current day (index 0) and the next day (index 1), I am using labels of
        // "today:" and "Tomorrow". This if statement gives the weekday names for the rest
        // of the days in the 5 day forecast (eg. "Monday" , "Tuesday", etc.)
        if (i > 1) {
            var pageWeekday = document.getElementById('day' + i + '-weekday');
            pageWeekday.textContent=arr[i].weekday + ":";
        };
        // for the first day, the city name populates on the page and UV index, all other
        // days are implied ot be the same city and UV index isn't required for the future days
        if (i === 0) {
            var cityNameFromAPI = document.getElementById('locationName');
            cityNameFromAPI.textContent = arr[i].city;
            pageUVindex.textContent = arr[0].uvIndex;
        };
        // the icon showing weather conditions URL needs the 3 digit code from the API to be relevant
        var pageIcon = document.getElementById('day' + i + '-icon');
        pageIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + arr[i].icon + '@2x.png');
        // plugs in the date in M/DD/YYYY format
        var pageDate = document.getElementById('day' + i + '-date');
        pageDate.textContent = arr[i].date;
        // plugging in the tempurature
        var pageTemp = document.getElementById('day' + i + '-temp');
        pageTemp.textContent = arr[i].temp;
        // plugging in percentage humidity
        var pageHumid = document.getElementById('day' + i + '-humid');
        pageHumid.textContent = arr[i].humid;
        // giving the wind speed in MPH
        var pageWind = document.getElementById('day' + i + '-wind');
        pageWind.textContent = arr[i].wind;
    };
};

// if the user has visited this page, lets bring in their search history
function loadHistory() {
    // if they have not visited the page, we set a baseline search history to local storage
    if (window.localStorage.getItem('weatherSearchHist') === null) {
        // start with an empty array
        var starterData = [];
        // give the default value shown on a blank page
        starterData.unshift('--');
        // stringify formats the data in a way local storage can hold it
        window.localStorage.setItem('weatherSearchHist',JSON.stringify(starterData));
    };
    // the user has history data, grab it
    var userHist = JSON.parse(window.localStorage.getItem('weatherSearchHist'));
    // calls a function that looks at the drop down list form element <select> and
    // removes all of its children
    cleanSlateList();
    // for loop creates and appends new drop down options from the user's search history
    for (var i = 0; i < userHist.length; i++) {
        var newOption = document.createElement('option');
        newOption.setAttribute('value', userHist[i]);
        newOption.textContent = userHist[i];
        searchHistoryEl.append(newOption);
    };
};

// looks at the search history drop down list and removes all children
function cleanSlateList() {
    // if it's got children...
    while (searchHistoryEl.firstChild) {
        // get rid of one & repeat.....
        searchHistoryEl.firstChild.remove();
    };
};

// function called any time the user does a new search, updates the search history data
function historyManagement() {
    // get the existing search history, not an "if statement" because the "loadHistory()" function
    // ensures there will always be at least the baseline  history information in local storage
    var userHist = JSON.parse(window.localStorage.getItem('weatherSearchHist'));
    // if starting with the baseline history that only has the '--' string....
    if (userHist.length == 1) {
        console.log('adding to history'); // tells us what is happening
        searchHistoryEl.firstChild.remove(); // empty the page element
        userHist.push(searchQueryInput.value); // add the new search to the end of the history list
        // if the history already has this search term, remove it from the list, and put it
        // up at the front of the list to reflect that it is a more recent search
    } else if (userHist.includes(searchQueryInput.value)){
        console.log('that was already in history, moving to top'); // lets us know what is happening
        indexToPull = userHist.indexOf(searchQueryInput.value); // looks at where the duplicate currenty lives
        userHist.splice(indexToPull, 1); // remove that duplicate
        userHist.shift(); // clear the '--' from the head of the list
        userHist.unshift(searchQueryInput.value); // add the search term which is no longer a duplicate
        userHist.unshift('--'); // put the '--' back in the beginning for consistent UI/UX
    } else {
        // this else statement is just adding the new term to the history
        console.log('continuing history'); // tells us what is happening
        searchHistoryEl.firstChild.remove(); // empty the page element
        userHist.shift(); // clear the '--' from the head of the list
        userHist.unshift(searchQueryInput.value); // add the search term
        userHist.unshift('--'); // put the '--' back in the beginning for consistent UI/UX
    };
    // save our updated array to local storage
    window.localStorage.setItem('weatherSearchHist',JSON.stringify(userHist));
    // calls a function that looks at the drop down list form element <select> and
    // removes all of its children
    cleanSlateList();
    // for loop creates and appends new drop down options from the user's updated search history
    for (var i = 0; i < userHist.length; i++) {
        var newOption = document.createElement('option');
        newOption.setAttribute('value', userHist[i]);
        newOption.textContent = userHist[i];
        searchHistoryEl.append(newOption);
    };

}

/* =========================================================================
 * ACTIVE EVENT LISTENERS
 * ========================================================================= */

// the user executable search query that initiates the fetch APIs and page
// population responses, as well as logging the search history
searchButtonEl.addEventListener("click", function(event) {
    event.preventDefault();
    var searchQuery = searchQueryInput.value;
    if (searchQuery != '') {
        historyManagement()
        rightNowWeather(searchQuery);
    };
});

// if a user looks through their search history and makes a selection,
// the page will treat this behavior as perofmring that search query again
searchHistoryEl.addEventListener('change', function (event) {
    event.preventDefault();
    console.log(event.target.value);
    searchQueryInput.value = event.target.value
    var searchQuery = searchQueryInput.value;
    historyManagement()
    rightNowWeather(searchQuery);
});

/* =========================================================================
 * ACTUAL PAGE LOAD LOGIC AND FUNCTION EXECUTION
 * ========================================================================= */

// bring in the search history on page load to kick off the user experience
loadHistory()