// Define the Weather class
class Weather {
    constructor() {
      this.temperature = null;
      this.apparentTemperature = null;
      this.windSpeed = null;
      this.isDay = null;
      this.rain = null;
      this.showers = null;
      this.snowfall = null;
      this.weatherCode = null;
      this.cloudCover = null;
    }
  
    async getWeatherData(x, y) {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${x}&longitude=${y}&current=temperature_2m,apparent_temperature,is_day,rain,showers,snowfall,weather_code,cloud_cover&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum&timezone=auto`
        );
        const data = await response.json();
  
        // Log the full API response
        console.log("Full API Response:", data);
  
        if (data && data.current) {
          // Extract current weather details
          this.temperature = data.current.temperature_2m;
          this.apparentTemperature = data.current.apparent_temperature;
          this.windSpeed = data.current.wind_speed || 0;
          this.isDay = data.current.is_day;
          this.rain = data.current.rain;
          this.showers = data.current.showers;
          this.snowfall = data.current.snowfall;
          this.weatherCode = data.current.weather_code;
          this.cloudCover =
            data.current.cloud_cover !== undefined ? data.current.cloud_cover : 0;
  
          // Log the extracted current weather information
          console.log("Current Temperature:", this.temperature);
          console.log("Apparent Temperature:", this.apparentTemperature);
          console.log("Is Daytime:", this.isDay);
          console.log("Rain:", this.rain);
          console.log("Showers:", this.showers);
          console.log("Snowfall:", this.snowfall);
          console.log("Cloud Cover:", this.cloudCover);
          console.log("Wind Speed:", this.windSpeed);
  
          return true; // Weather data retrieved successfully
        } else {
          // Log an error if the response structure is not as expected
          console.error("Invalid API Response:", data);
          return false; // Weather data retrieval failed
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return false; // Weather data retrieval failed
      }
    }
  }
  
  // Define the App class
  export default class App {
    constructor() {
      // Bind methods to the current instance
      this.gotLocation = this.gotLocation.bind(this);
      this.errorLocation = this.errorLocation.bind(this);
      this.getPokemon = this.getPokemon.bind(this);
  
      // Create an instance of the Weather class
      this.weather = new Weather();
  
      // Run the app after the DOM has fully loaded
      document.addEventListener("DOMContentLoaded", () => {
        // Trigger the geolocation request
        this.getLocation();
      });
    }
  
    // Method to get the current geolocation
    getLocation() {
      navigator.geolocation.getCurrentPosition(this.gotLocation, this.errorLocation);
    }
  
    // Callback method when geolocation is obtained successfully
    async gotLocation(result) {
      // Extract latitude and longitude from the result
      const x = result.coords.latitude;
      const y = result.coords.longitude;
  
      // Call the method to get weather information
      const weatherDataRetrieved = await this.weather.getWeatherData(x, y);
  
      if (weatherDataRetrieved) {
        // Display the current weather information on the HTML page
        document.querySelector('h2').innerHTML = `🌡️ Temperature: ${this.weather.temperature}°C (Apparent Temperature: ${this.weather.apparentTemperature}°C)`;
        document.getElementById('current-temperature').innerText = `Temperature: ${this.weather.temperature}°C`;
        document.getElementById('current-wind-speed').innerText = `Wind Speed: ${this.weather.windSpeed}m/s`;
        document.getElementById('is-day').innerText = `Daytime: ${this.weather.isDay ? 'Yes' : 'No'}`;
        document.getElementById('rain').innerText = `Rain: ${this.weather.rain}mm`;
        document.getElementById('showers').innerText = `Showers: ${this.weather.showers}mm`;
        document.getElementById('snowfall').innerText = `Snowfall: ${this.weather.snowfall}cm`;
        document.getElementById('cloud-cover').innerText = `Cloud Cover: ${this.weather.cloudCover}%`;
  
        // Fetch Pokemon based on weather conditions
        this.getPokemon();
      }
    }
  
    getPokemon() {
        // Use the weather information stored in the Weather class
        const { weatherCode, rain, snowfall, isDay } = this.weather;
    
        // Default Pokemon
        let primaryPokemonEndpoint = 'https://pokeapi.co/api/v2/pokemon/1/';
        let secondaryPokemonEndpoint = null;
    
        // Customize Pokemon based on weather conditions
        if (rain > 0) {
            // Display water Pokemon when it's raining
            secondaryPokemonEndpoint = 'https://pokeapi.co/api/v2/pokemon/7/'; // Squirtle
        } else if (snowfall > 0) {
            // Display ice Pokemon when it's snowing
            secondaryPokemonEndpoint = 'https://pokeapi.co/api/v2/pokemon/4/'; // Charmander
        } else if (weatherCode === 800) {
            // Display fire Pokemon when it's clear sky
            secondaryPokemonEndpoint = 'https://pokeapi.co/api/v2/pokemon/37/'; // Vulpix
        }
    
        // Check if it's nighttime
        if (!isDay) {
            // Display a ghost Pokemon when it's nighttime
            primaryPokemonEndpoint = 'https://pokeapi.co/api/v2/pokemon/92/'; // Gastly
        }
    
        // Make fetch requests to both Pokemon endpoints simultaneously
        Promise.all([
            fetch(primaryPokemonEndpoint),
            secondaryPokemonEndpoint ? fetch(secondaryPokemonEndpoint) : Promise.resolve(null)
        ])
            .then(responses => Promise.all(responses.map(response => response ? response.json() : null)))
            .then(data => {
                // Log the Pokemon API responses
                console.log("Primary Pokemon API Response:", data[0]);
                console.log("Secondary Pokemon API Response:", data[1]);
    
                // Display the primary Pokemon details on the HTML page
                if (data[0] && data[0].name && data[0].sprites && data[0].sprites.front_default) {
                    const primaryPokemonName = data[0].name;
                    const primaryPokemonImage = data[0].sprites.front_default;
                    document.getElementById('pokemon-name').innerText = `Primary Pokemon: ${primaryPokemonName}`;
                    document.getElementById('pokemon-image').src = primaryPokemonImage;
                } else {
                    console.error("Invalid Primary Pokemon API Response:", data[0]);
                }
    
                // Display the secondary Pokemon details on the HTML page if it exists
                if (data[1] && data[1].name && data[1].sprites && data[1].sprites.front_default) {
                    const secondaryPokemonName = data[1].name;
                    const secondaryPokemonImage = data[1].sprites.front_default;
                    // Display the secondary Pokemon details next to the primary Pokemon
                    const secondaryPokemonElement = document.createElement('div');
                    secondaryPokemonElement.innerHTML = `<p>Secondary Pokemon: ${secondaryPokemonName}</p><img src="${secondaryPokemonImage}" alt="Secondary Pokemon Image" style="max-width: 100px; max-height: 100px;" />`;
                    document.getElementById('app').appendChild(secondaryPokemonElement);
                } else if (secondaryPokemonEndpoint) {
                    // Log a message if the secondary endpoint was specified but no data was retrieved
                    console.error("Invalid Secondary Pokemon API Response:", data[1]);
                }
            })
            .catch(error => console.log(error));
    }
    
    
    
  
    // Callback method for handling geolocation errors
    errorLocation(error) {
      console.error("Geolocation error:", error);
    }
  }
  
  // Run the app after the DOM has fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    const app = new App();
  });
  

  // Add this inside your JavaScript code where you set up other elements
const advertisingTitle = document.getElementById('advertising-title');
advertisingTitle.innerText = "It's raining outside! Water Pokemon are playing. This is your chance to catch them!";

