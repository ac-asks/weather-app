/* UI Element Module */
// Module responsible for controlling UI elements like 'menu'

const UI = (function() {

    // select the menu
    let menu = document.querySelector("#menu-container");

    const showApp = () => {

        document.querySelector('#app-loader').classList.add('display-none');
        document.querySelector("main").removeAttribute('hidden');
    };

    const loadApp = () => {

        document.querySelector('#app-loader').classList.remove('display-none');
        document.querySelector("main").setAttribute('hidden', 'true');

    };

    const _showMenu = () => menu.style.right = 0;

    const _hideMenu = () => menu.style.right = '-65%';

    const _toggleHourlyWeather = () => {
            let hourlyWeather = document.querySelector("#hourly-weather-wrapper"),
                    arrow = document.querySelector("#toggle-hourly-weather").children[0],
                    visible = hourlyWeather.getAttribute('visible'),
                    dailyWeather = document.querySelector("#daily-weather-wrapper");

                    if( visible == "false") {
                        hourlyWeather.setAttribute('visible', 
                        'true') // set visible attribute to true
                        hourlyWeather.style.bottom = 0; // show hourly panel
                        arrow.style.transform="rotate(180deg)" // rotate arrow
                        dailyWeather.style.opacity =  0; // hide the weather panel
                    } else if( visible = 'true' ) {
                        hourlyWeather.setAttribute('visible', 
                        'false') // set visible attribute to true
                        hourlyWeather.style.bottom = '-100%'; // show hourly panel
                        arrow.style.transform="rotate(0deg)" // rotate arrow
                        dailyWeather.style.opacity =  1; // hide the weather panel
                    } else console.error("Unknown state of the hourly weather panel and visible attribute");
                


    };

    const drawWeatherData = (data, location) => {
        console.log(data)
        console.log(location)

    
        let currentlyData = data.currently,
            dailyData = data.daily.data,
            hourlyData = data.hourly.data,
            weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dailyWeatherWrapper = document.querySelector("#daily-weather-wrapper"),
            dailyWeatherModel, // store our model -- copy container from interface and store inside this
            day, // stores the day taken from the array
            maxMinTemp, // store string, which will be min and max temp
            dailyIcon, // stores icon for that date
            hourlyWeatherWrapper = document.querySelector("#hourly-weather-wrapper"),
            hourlyWeatherModel,
            hourlyIcon;

        
        //set current weather

        // set current location
        document.querySelectorAll(".location-label").forEach( (eachArrayElement) => {
            eachArrayElement.innerHTML = location;

        });

        // set the background according to the weather
        document.querySelector("main").style.backgroundImage = `url("./assets/images/bg-images/${currentlyData.icon}.jpg")`;
        // set the current icon
        document.querySelector("#currentlyIcon").setAttribute('src', `./assets/images/summary-icons/${currentlyData.icon}-white.png`);
        // set the summary
        document.querySelector("#summary-label").innerHTML = currentlyData.summary;
        // set temperature (from Farenheit to Celsius)
        document.querySelector("#degrees-label").innerHTML = Math.round(((
            currentlyData.temperature - 32) * 5 /9)) + '&#176;'
        // set humidity
        document.querySelector("#humidity-label").innerHTML = Math.round(
            currentlyData.humidity * 100) + '%';
        document.querySelector("#wind-speed-label").innerHTML = (
            currentlyData.windSpeed * 1.6093).toFixed(1) + ' kph';    
            
        while(dailyWeatherWrapper.children[1]) { // deletes the current day data if there is an element in position 1
            dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1]) // delete that element
        }

        for(let i = 0; i <= 6; i++) {
            // clone the node and remove display none 
            // clone the first weather box
            dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true); // copies element of first element inside container
            dailyWeatherModel.classList.remove("display-none"); // delete display none because we want to show the elements
            
            // set date using the time property in milliseconds, then use that to get date and day
            day = weekDays[new Date(dailyData[i].time * 1000).getDay()] // get the day of the week
            dailyWeatherModel.children[0].children[0].innerHTML = day;
            
            //set min and max temperature for the next days in Celcius
            maxMinTemp = Math.round( (dailyData[i].temperatureMax - 32) * 5 / 9) +
            `&#176;` + Math.round( (dailyData[i].temperatureMax - 32) * 5 / 9) +  `&#176;`;
            dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;

            // set daily icon
            dailyIcon = dailyData[i].icon;
            dailyWeatherModel.children[1].children[0].setAttribute('src', `./assets/images/summary-icons/${dailyIcon}-white.png`);
            
            //apend the model
            dailyWeatherWrapper.appendChild(dailyWeatherModel);
        
        }

        // set circle pointing to current day

        dailyWeatherWrapper.children[1].classList.add('current-day-of-the-week');

        // SET HOURLY WEATHER
        // =================

        while(hourlyWeatherWrapper.children[1]) { // deletes the current day data if there is an element in position 1
            hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1]) // delete that element
        }

        for(let i = 0; i <= 24; i++) {
            hourlyWeatherModel = hourlyWeatherWrapper.children[0].cloneNode(true);
            hourlyWeatherModel.classList.remove("display-none");

            // set hour
            hourlyWeatherModel.children[0].children[0].innerHTML = new Date( hourlyData[i].time * 1000).getHours() + ":00";
            
            // set temperature
            hourlyWeatherModel.children[1].children[0].innerHTML = Math.round((hourlyData[i].temperature - 32) * 5 / 9) + '&#176;';

            // set the icon
            hourlyIcon = hourlyData[i].icon;
            hourlyWeatherModel.children[1].children[1].children[0].setAttribute("src",
        `./assets/images/summary-icons/${hourlyIcon}-grey.png`);

            // append model
            hourlyWeatherWrapper.appendChild(hourlyWeatherModel);
        }
        
        UI.showApp(); // when application done with drawing elements, we are ready to hide loading screen
        // and show the application
    };


    document.querySelector("#open-menu-btn").addEventListener('click', _showMenu);
    document.querySelector("#close-menu-btn").addEventListener('click', _hideMenu);

    // hourly weather wrapper event
    document.querySelector("#toggle-hourly-weather").addEventListener('click', _toggleHourlyWeather);
    
    // export these functions outside of UI controller
    return {
        showApp,
        loadApp, // export function outside
        drawWeatherData
    };


})();

// GET LOCATION MODULE
// module gets data about location to search for weather

const GETLOCATION =(function() {

    let location;

    // save these variables so it is more convenient
    const locationInput = document.querySelector("#location-input"),
        addCityBtn = document.querySelector("#add-city-btn");

    const _addCity = () => {
            location = locationInput.value; // get input
            locationInput.value = ""; // reset input
            // disable buttono again
            addCityBtn.setAttribute('disabled', 'true');
            addCityBtn.classList.add('disabled');

            // get weather data
            WEATHER.getWeather(location); // get weather and send location as argument
    }

    locationInput.addEventListener('input', function() {
            
        let inputText = this.value.trim(); // this.value returns the text written inside the input
        
        if (inputText != '') {
            addCityBtn.removeAttribute('disabled');
            addCityBtn.classList.remove('disabled');

        } else {
            addCityBtn.setAttribute('disabled', 'true');
            addCityBtn.classList.add('disabled');
        }

    })

    addCityBtn.addEventListener('click', _addCity);

})();

/* WEATHER MODULE
Gets weather data -- module will acquire weather data then passes it to another module, 
which will put the data on UI */

const WEATHER =(function() {

    const darkSkyKey = '817cde0f5cbe28f51f590cc43064f8e5', // weather API key
        geocodeKey = 'f87142cd0a7f4c3e839a2cfecda36f3f'; 

    
    const _getGeocodeURL = (location) =>
    `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${geocodeKey}`;

    // cors error so we need to use cors anywhere proxy to allow for cross origin
    const _getDarkSkyURL = (lat, lng) => 
        `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lng}`;

    const _getDarkSkyData = (url, location) => {
        axios.get(url)
            .then( (response) => {
                console.log(response);
                UI.drawWeatherData(response.data, location)

            })
            .catch( (errorsDetected) => {
                console.error(errorsDetected);
            })
    };

    const getWeather = (location) => {

        // set application as loading
        UI.loadApp();

        // get URL from Geocode API using hte getGeocodeURL
        let geocodeURL = _getGeocodeURL(location);

        // make AJAX call to this address (geocodeURL)
        axios.get(geocodeURL)
            .then( (response) => { // then will call if the request has successfully finished
                // this method will receive the parameter as the response object. This contains
                // the data we are interested in
 
                let lat = response.data.results[0].geometry.lat,
                    lng = response.data.results[0].geometry.lng;

                let darkSkyURL = _getDarkSkyURL(lat,lng);
                _getDarkSkyData(darkSkyURL, location);
            })

            .catch( (errorsDetected) => { // catch will call if there are any errors
                // This method will receive as the parameter the error object. This contains information
                // about the error
                console.log(errorsDetected);

            })

    };
    
    return{
        getWeather
    }
    
})();


/* Init i.e. initialisation */

// this property detects when the page has loaded
window.onload = function () {
    UI.showApp();
}