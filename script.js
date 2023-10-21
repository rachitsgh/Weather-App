const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]")
const myCitiesTab = document.querySelector("[data-myCities]");
const userContainer = document.querySelector(".weather-container");

const myCitiesInfo = document.querySelector("[data-myCitiesInfo]");
const grantAccessContainer = document.querySelector(".weather-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container"); 


let currentTab = userTab;
const API_KEY ="4034469fbc4374e4dbde8a9d4acd9bf4";
currentTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(newTab){
    if (newTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = newTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active") && newTab == searchTab) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            myCitiesInfo.classList.remove("active");
            searchForm.classList.add("active");
        } else if (!userInfoContainer.classList.contains("active") && newTab == userTab) {
            grantAccessContainer.classList.remove("active");
            myCitiesInfo.classList.remove("active");
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");
            getfromSessionStorage();
        } else if (!myCitiesInfo.classList.contains("active") && newTab == myCitiesTab) {
            // Add logic for the "My Cities" tab here
            // For example, display a list of saved cities
            grantAccessContainer.classList.remove("active");
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            myCitiesInfo.classList.add("active");
        } else {
            grantAccessContainer.classList.remove("active");
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            myCitiesInfo.classList.remove("active");
      
        }
    }
}

userTab.addEventListener('click',()=>{
    // pass clicked tab as a paramater
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    // pass clicked tab as a paramater
    switchTab(searchTab);
});

myCitiesTab.addEventListener('click',()=>{
    // pass clicked tab as a paramater
    switchTab(myCitiesTab );
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add(".active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}


async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        // loadingScreen.classList.remove("active");
        //HW

    }

}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 
 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPositon);
    }else{
        // show an alert for no geo location support available
    }
}

function showPositon(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates); 
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

const searchInput =document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add(".active");
    userInfoContainer.classList.remove(".active");
    grantAccessButton.classList.remove(".active");
    myCitiesInfo.classList.remove(".active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data =await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){

    }
}