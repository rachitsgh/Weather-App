const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]")
const myCitiesTab = document.querySelector("[data-myCities]");
const userContainer = document.querySelector(".weather-container");
const apiErrorContainer = document.querySelector(".api-error-container");

const myCitiesInfo = document.querySelector("[data-myCitiesInfo]");
const grantAccessContainer = document.querySelector(".grant-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container"); 

const saveCityButton2 = document.querySelector(".button");
const savedCitiesSection = document.querySelector(".my-cities");

const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");
const savedcitieshey = document.querySelector(".saved-city");




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
            console.log("switche to user info")
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
    console.log("getfrmssnstrg");
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
        // getfromSessionStorage();
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        // console.log(coordinates);
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
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorImg.style.display = "none";
        apiErrorMessage.innerText = `Error: ${err?.message}`;
        apiErrorBtn.addEventListener("click", () => {
            fetchUserWeatherInfo(coordinates);
        });
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
        alert("geo locatio is not supported in you device");
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

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    apiErrorContainer.classList.remove("active");
  
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      // console.log("Search - Api Fetch Data", data);
      if (!data.sys) {
        throw data;
      }
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    } catch (error) {
      // console.log("Search - Api Fetch Error", error.message);
      loadingScreen.classList.remove("active");
      apiErrorContainer.classList.add("active");
      apiErrorMessage.innerText = `${error?.message}`;
      apiErrorBtn.style.display = "none";
    }
  }


saveCityButton2.addEventListener('click',()=>{
    console.log("clicked");
    save();
});

function save() {
    // Fetch the city name and temperature
    const cityNameElement = document.querySelector("[data-cityName]");
    const cityName = cityNameElement.textContent;
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    if (!savedCities.includes(cityName)) {
        // City is not saved, so save it
        savedCities.push(cityName);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
        displaySavedCityWeather(cityName);
    } else {
        // City is already saved, you can display a message or take appropriate action
        alert('This city is already saved.');
    }


}

// Function to fetch and display real-time temperature for a saved city
async function displaySavedCityWeather(cityName) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        // Create a new element to display the saved city
        const savedCityElement = document.createElement('div');
        savedCityElement.classList.add('saved-city');

        // Create elements to display the city name and temperature
        const cityNameDiv = document.createElement('div');
        cityNameDiv.classList.add('saved-city-name');
        cityNameDiv.textContent = cityName;

        const tempDiv = document.createElement('div');
        tempDiv.classList.add('saved-city-temp');
        tempDiv.textContent = `${data.main.temp} °C`; // Display real-time temperature

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btnn');
        deleteButton.innerHTML = `
            <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" class="icon">
                <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
            </svg>
        `;
        deleteButton.addEventListener('click', () => {
            removeSavedCity(cityName, savedCityElement);
        });


        // Append the elements to the savedCityElement
        savedCityElement.appendChild(cityNameDiv);
        savedCityElement.appendChild(tempDiv);
        savedCityElement.appendChild(deleteButton);

        // Append the savedCityElement to the savedCitiesSection
        savedCitiesSection.appendChild(savedCityElement);
    } catch (error) {
        // Handle errors when fetching city weather
    }
}

// Function to remove a saved city
function removeSavedCity(cityName, savedCityElement) {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    const index = savedCities.indexOf(cityName);
    if (index !== -1) {
        savedCities.splice(index, 1);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
        savedCityElement.remove(); // Remove the displayed city element
    }
}

// Function to display saved cities
function displaySavedCities() {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    savedCities.forEach(city => {
        displaySavedCityWeather(city);
    });
}

// Call the function to display saved cities when the page loads
displaySavedCities();
 





