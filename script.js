// Replace bhopal by city search name
const SEARCH_BY_CITY_NAME = "https://api.openweathermap.org/data/2.5/weather?q=bhopal&appid=5e9a44add76acccd4dd712d72ae46bc2";

// To get weather info of current coordinates by replacing longitude and latitude
const GET_BY_COORD = "https://api.openweathermap.org/data/2.5/weather?lat=latitude&lon=longitude&appid=5e9a44add76acccd4dd712d72ae46bc2"

// Replace 10d by current icon id
const ICON_API = "https://openweathermap.org/img/wn/10d@2x.png";

const cityName = document.getElementById('cityName')
const image = document.getElementById("whetherImage");
const currentTemp = document.querySelector(".current-temp");
const description = document.querySelector(".description");
const minMax = document.querySelector(".other-info");
const humidWindPressure = document.querySelector(".humid-wind-pressure");
const inputField = document.getElementById('input');
const section = document.querySelector('section');
const nothingFound = document.querySelector(".nothing-found");
const backdrop = document.querySelector('.backdrop');

// searchapi get called each time when keydown Event trggers 
inputField.addEventListener('keydown',searchapi);

// on load we will load current coordinate weather details
window.onload = function (){
    let coord={};
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            currentCityWeatherApiCall(position.coords.latitude,position.coords.longitude);
        })
    }
    else{
        console.log('geolocation not supported');
    }
}

// This make api call for current coordinates

function currentCityWeatherApiCall(latitude,longitude){
    let searchapi = GET_BY_COORD.replace('latitude',latitude);
    searchapi = searchapi.replace('longitude',longitude);
    console.log(searchapi);
    console.log(latitude,longitude);
    fetch(searchapi).then(responce=>responce.json())
    .then(data=>{
        console.log(data)
        showCityData(data);
    })
}
// This function is used for search api call which also check, is searched city in database or not
function searchapi(e){
    console.log(e.code)
    let toSearch='';
    if (e.code !== "Enter") {
        return;
    }
    toSearch = inputField.value;
    inputField.value = "";
    let searchapi = SEARCH_BY_CITY_NAME.replace('bhopal',toSearch);
    const responce = fetch(searchapi).then(responce=>responce.json()).then((data)=>{
        console.log(data);
        if(data.cod == 404){
            showNothingDialog();
        }
        else{
            showCityData(data);
        }
    })
}
// This function is responsible for displaying all info in the Dom

function showCityData(data){
    cityName.innerText = data.name;
    let src = ICON_API.replace('10d',data.weather[0].icon);
    image.src = src;
    console.log(image.src)
    currentTemp.innerHTML =getTempInCelcius(data.main.temp)
    description.innerText = data.weather[0].description;
    minMax.children[0].innerHTML = 'min '+ getTempInCelcius(data.main.temp_min); 
    minMax.children[1].innerHTML = 'max '+ getTempInCelcius(data.main.temp_max); 
    console.log(humidWindPressure)
    humidWindPressure.children[0].children[1].nnerHTML = data.wind.speed + ' km/h'
    humidWindPressure.children[1].children[1].innerHTML = data.main.humidity + ' %'
}
// Kelvin to degree celsius converter

function getTempInCelcius(temp){
    return (temp - 273.15).toFixed(1) + "<sup>o</sup>C";
}
// popup dialog for when searched city not found

function showNothingDialog(){
   nothingFound.style.transform = 'translateY(0)'
   backdrop.style.display = 'block';
   backdrop.addEventListener('click',()=>{
       nothingFound.style.transform = "translateY(-100vh)";
       backdrop.style.display = "none";
   },{once:true})
}
