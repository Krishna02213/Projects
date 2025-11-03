// --- API Configuration ---
// Base URL and Key provided by the user
const apiKey = "a9f58d3cb08c4c89a97182337250211";
const baseUrl = "http://api.weatherapi.com/v1/current.json";

// --- DOM Element References ---
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const conditionElement = document.getElementById('condition');
const iconElement = document.getElementById('weather-icon');
const cityInputElement = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const errorMessageElement = document.getElementById('error-message');

/**
 * Fetches weather data for a specified city from the WeatherAPI.
 * @param {string} city - The name of the city to get weather for.
 */
async function getWeatherData(city) {
    if (!city) return;
    errorMessageElement.textContent = ""; // Clear previous errors

    // Construct the full API URL
    // encodeURIComponent handles spaces and special characters in city names
    const url = `${baseUrl}?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`;

    try {
        // Display a loading state while fetching
        locationElement.textContent = "Loading...";
        temperatureElement.textContent = "--°C";
        conditionElement.textContent = "--";
        iconElement.src = ""; 

        const response = await fetch(url);
        const data = await response.json();

        // Check for API-specific errors (e.g., city not found)
        if (data.error) {
            // Throw an error to be caught in the catch block
            throw new Error(data.error.message || "City not found or API error.");
        }

        // --- Success: Update DOM with weather information ---
        const locationName = data.location.name;
        const country = data.location.country;
        const tempC = data.current.temp_c;
        const conditionText = data.current.condition.text;
        const iconUrl = data.current.condition.icon;
        
        locationElement.textContent = `${locationName}, ${country}`;
        temperatureElement.textContent = `${tempC}°C`;
        conditionElement.textContent = conditionText;
        // The API provides relative paths, so we prepend 'http:'
        iconElement.src = `http:${iconUrl}`; 

    } catch (error) {
        // --- Error Handling ---
        console.error("Error fetching weather data:", error.message);
        locationElement.textContent = "Location Error";
        temperatureElement.textContent = "--°C";
        conditionElement.textContent = "Check city name.";
        iconElement.src = "";
        errorMessageElement.textContent = `Error: ${error.message}`;
    }
}

// --- Event Listeners ---

// 1. Search Button Click
searchButton.addEventListener('click', () => {
    const city = cityInputElement.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

// 2. 'Enter' Key Press in the input field
cityInputElement.addEventListener('keypress', (event) => {
    // Check if the pressed key is 'Enter'
    if (event.key === 'Enter') {
        searchButton.click(); // Trigger the search button's click event
    }
});

// --- Initialization ---

// Load the weather for a default city when the app starts
getWeatherData("London");