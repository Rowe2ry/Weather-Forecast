/* =========================================================================
 * GRAB DOM ELEMENTS FOR REFERENCE
 * ========================================================================= */

var searchQueryInput = document.getElementById('cityName');
var searchHistoryEl = document.getElementById('search-history');
var searchButtonEl = document.getElementById('search-btn');

/* =========================================================================
 * DECLARE &/OR ASSIGN GLOBAL SCOPE VARIABLE
 * ========================================================================= */

var APIkeyCurrent = '00d31542c0f530cb4f115dab6831ce15';
var APIkeyFiveDay = 'd2615aa0825538ecfc67550581ba6a13';

/* =========================================================================
 * FUNCTION DEFINITIONS
 * ========================================================================= */

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
                                day: "day" + (i),
                                date: moment(data.daily[i].dt, 'X').format('l'),
                                weekday: moment(data.daily[i].dt, 'X').format('dddd'),
                                icon: data.daily[i].weather[0].icon,
                                temp: data.daily[i].temp.day +'°F',
                                wind: data.daily[i].wind_speed + 'mph',
                                humid: data.daily[i].humidity + '%',
                                uvIndex: data.daily[0].uvi
                            };
                            fiveDayRelevantdata.push(objectDay);
                        }
                        console.log('6 days of relevant data here');
                        console.log(fiveDayRelevantdata);
                        populatePage(fiveDayRelevantdata);
                    });
                } else {
                    console.log('error friend');
                };
        });
    
};

function populatePage (arr) {
    var pageUVindex = document.getElementById('day0-uv');
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
    for (i = 0; i < arr.length; i++) {
        if (i > 1) {
            var pageWeekday = document.getElementById('day' + i + '-weekday');
            pageWeekday.textContent=arr[i].weekday + ":";
        };
        if (i === 0) {
            var cityNameFromAPI = document.getElementById('locationName');
            cityNameFromAPI.textContent = arr[i].city;
            pageUVindex.textContent = arr[0].uvIndex;
        };
        var pageIcon = document.getElementById('day' + i + '-icon');
        pageIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + arr[i].icon + '@2x.png');
        var pageDate = document.getElementById('day' + i + '-date');
        pageDate.textContent = arr[i].date;
        var pageTemp = document.getElementById('day' + i + '-temp');
        pageTemp.textContent = arr[i].temp;
        var pageHumid = document.getElementById('day' + i + '-humid');
        pageHumid.textContent = arr[i].humid;
        var pageWind = document.getElementById('day' + i + '-wind');
        pageWind.textContent = arr[i].wind;
    };
};
function loadHistory() {
    if (window.localStorage.getItem('weatherSearchHist') === null) {
        var starterData = [];
        starterData.unshift('--');
        window.localStorage.setItem('weatherSearchHist',JSON.stringify(starterData));
    };
    var userHist = JSON.parse(window.localStorage.getItem('weatherSearchHist'));
    cleanSlateList();
    for (var i = 0; i < userHist.length; i++) {
        var newOption = document.createElement('option');
        newOption.setAttribute('value', 'Option ' + (i + 1));
        newOption.textContent = userHist[i];
        searchHistoryEl.append(newOption);
    };
};

function cleanSlateList() {
    while (searchHistoryEl.firstChild) {
        searchHistoryEl.firstChild.remove();
    }
}

function historyManagement() {
    var userHist = JSON.parse(window.localStorage.getItem('weatherSearchHist'));
    if (userHist.length == 1) {
        console.log('adding to history');
        searchHistoryEl.firstChild.remove();
        userHist.shift();
        userHist.unshift(searchQueryInput.value);
        userHist.unshift('--');
    } else if (userHist.includes(searchQueryInput.value)){
        console.log('that was already in history, moving to top');
        indexToPull = userHist.indexOf(searchQueryInput.value);
        userHist.splice(indexToPull, 1);
        userHist.shift();
        userHist.unshift(searchQueryInput.value);
        userHist.unshift('--');
    } else {
        console.log('continuing history');
        searchHistoryEl.firstChild.remove();
        userHist.shift();
        userHist.unshift(searchQueryInput.value);
        userHist.unshift('--');
    };
    window.localStorage.setItem('weatherSearchHist',JSON.stringify(userHist));
    var optionsToRemove = searchHistoryEl.childElementCount;
    cleanSlateList();
    for (var i = 0; i < userHist.length; i++) {
        var newOption = document.createElement('option');
        newOption.setAttribute('value', 'Option ' + (i + 1));
        newOption.textContent = userHist[i];
        searchHistoryEl.append(newOption);
    };

}

/* =========================================================================
 * ACTIVE EVENT LISTENERS
 * ========================================================================= */



searchButtonEl.addEventListener("click", function(event) {
    event.preventDefault();
    var searchQuery = searchQueryInput.value;
    if (searchQuery != '') {
        historyManagement()
        rightNowWeather(searchQuery);
    }
});

//TODO: option event listener (on "change", #search-history)
    // if the user clicks something from their history, pass that value (toLowercase)
    // into the "rightNowWeather()" function

/* =========================================================================
 * ACTUAL PAGE LOAD LOGIC AND FUNCTION EXECUTION
 * ========================================================================= */

loadHistory()