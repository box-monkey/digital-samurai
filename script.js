// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key} - standard api call for reference
// ** TODO
// TODO find out replication bug - one liner? smh. 
// TODO display the search history

// api key linked to account
const weatherApiKey = "932966538ed5411e38b3802b798112a3";

// variables section
const dayTemperature = document.getElementById("temperature");
const dayHumdidity = document.getElementById("humidity");
const dayWindSpeed = document.getElementById("wind-speed");
const dayUVIndex = document.getElementById("uv-index");

const currentCity = document.getElementById("enter-city");
const citySearchBtn = document.getElementById("search-button");
const nameCity = document.getElementById("city-name");
const fiveDayHeader = document.getElementById("fiveday-header");
const fiveDayforecast = document.getElementById("five-day-forecast");
// const citySearchHistory = document.getElementById("city-history");

const fiveDayForecastDay1 = document.getElementById('five-day-forecast-day-1');
const fiveDayForecastDay2 = document.getElementById('five-day-forecast-day-2');
const fiveDayForecastDay3 = document.getElementById('five-day-forecast-day-3');
const fiveDayForecastDay4 = document.getElementById('five-day-forecast-day-4');
const fiveDayForecastDay5 = document.getElementById('five-day-forecast-day-5');


// arrays are special since the contents inside are being manipulated, not it's self. So arrays can be a const unless being completely overwritten. I don't think this actually clarifies, it just makes more confusing
const history = [];
let humidity = null;
let temp = null;
let uv = null;
let windSpeed = null;
let localStorageKey = null;
fiveDayForecastDay1.innerHTML = ""; fiveDayForecastDay1.innerHTML = "";

function initialLoad() {
  reset();
}

function reset() {
  fiveDayHeader.style.display = "none";

  fiveDayForecastDay1.innerHTML = "";
  fiveDayForecastDay2.innerHTML = "";
  fiveDayForecastDay3.innerHTML = "";
  fiveDayForecastDay4.innerHTML = "";
  fiveDayForecastDay5.innerHTML = "";
}

function search() {
  const searchTerm = currentCity.value;
  console.log("search -> searchTerm", searchTerm);
  // add to snippet ---
  // if (variable == null) // == forces variable to string then does a string comparison, === does a direct comparison which won't work
  if (searchTerm == null) {
    console.warn("text is missing");
  } else {
    // .push - pushes data in search term into history array.
    history.push(searchTerm);
    getWeather(searchTerm);
    console.log('search -> history', history);
  }
}

/**
 * gets the weather data based on a city "search term"
 */
function getWeather(searchTerm) {
  // ? delimits URL Params from URL
  // & delimits terms from each other
  // q = seachTerm
  // appId = API key
  const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${weatherApiKey}&units=imperial`;
  fetch(encodeURI(weatherApi))
    .then((response) => response.json())
    .then((responseData) => {
      const lon = responseData.coord.lon;
      const lat = responseData.coord.lat;
      return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`
      );
    })
    .then((response) => response.json())
    .then((responseData) => {
      return parseApiData(responseData);
    });
    // // outputs error if unable to search
    // .catch((error) => {
    //   throw new Error("ERR-1 : Rut-Roh Shaggy", error);
    // });
}

function parseApiData(responseData) {
  console.log("parseApiData results", responseData);
  humidity = responseData.current.humidity;
  temp = responseData.current.temp;
  uv = responseData.current.uvi;
  windSpeed = responseData.current.wind_speed;

  dayHumdidity.innerHTML = `${humidity} %`;
  dayTemperature.innerHTML = `${temp} °F`;
  dayUVIndex.innerHTML = `${uv}`;
  dayWindSpeed.innerHTML = `${windSpeed} MPH`;
 // before data collection
  for (let i = 0; i < responseData.daily.length; i += 1) {
    if (i > 0) { // Skip the first day, that's leg day
      if (i < 6) { // Break out of loop if you're more than 5 days out
        const day = responseData.daily[i];
        parseDayData(day, i);  
      } else {
        break; // breaks out of a loop
      }
    }
  }
  
  // after data collection
  fiveDayHeader.style.display = "flex";
}


function parseDayData(day, index) {
  console.log(`parseDayData ${index}`, day);

  const dayDate = convertEpochToAmericanDate(day.dt);
  const dayHumidity = day.humidity;
  const dayTemp = day.temp;
  const dayWindSpeed = day.windSpeed

  let weatherPic = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

  let dayDiv = document.getElementById(`five-day-forecast-day-${index}`);

  let image = new Image();
  image.src = weatherPic;
  dayDiv.appendChild(image);
 
  // dynamically creating P elements
  let dateTextBox = document.createElement("p");
  dateTextBox.innerHTML = dayDate;
  dayDiv.appendChild(dateTextBox);

  let humidityText = document.createElement("p");
  humidityText.innerHTML = `humidity: ${dayHumidity} %`;
  dayDiv.appendChild(humidityText);
 
  // showing as object object
  let tempText = document.createElement("p");
  tempText.innerHTML = `temp: ${dayTemp}°F`;
  dayDiv.appendChild(tempText);

  // showing as undefined
  let windText = document.createElement("p");
  windText.innerHTML = `wind speed: ${dayWindSpeed}`;
  dayDiv.appendChild(windText);

}

reset(parseDayData);

// render search history 
// function renderSearchHistory() {
//   cityHistory = "";
//   for (let i = 0; i < citySearchHistory.length; i += 1) {
//     const history = document.createElement("p");
//     history.setItem("type", "text");
//     history.setItem("class", "city-history d-block bg-white");
//     history.setItem("value", citySearchHistory[i]);
//     history.addEventListener("click", function () {
//       getWeather(history.value);
//     });
//     cityHistory.append(history);
//   } 
// }

// renderSearchHistory();
// if (searchHistory.length > 0) {
//     getWeather(searchHistory[searchHistory.length - 1]);
// }



// function renderHistory() {
// //   const cityHistory = citySearchHistory
// //   citySearchHistory.innerHTML = "";
// // for(let i = 0; i < history.length; i += 1) {
//  localStorage.setItem(localStorageKey, JSON.stringify(currentCity));
// }

// function displayHistory() {

// }

// epoch time conversion
function convertEpochToAmericanDate(epoch) {
  let dateTime = new Date(0);
  dateTime.setUTCSeconds(epoch);
  const forecastDay = dateTime.getDate();
  const forecastMonth = dateTime.getMonth() + 1;
  const forecastYear = dateTime.getFullYear();
  return `${forecastMonth}/${forecastDay}/${forecastYear}`;
}

initialLoad();
citySearchBtn.addEventListener("click", search);
