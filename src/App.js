// Import necessary modules or styles if any

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
        console.log(error);
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
    gotLocation(result) {
      // Extract latitude and longitude from the result
      const x = result.coords.latitude;
      const y = result.coords.longitude;
  
      // Call the method to get weather information
      this.getWeather(x, y);
      this.getPokemon(); // Fetch Pokemon as well
    }
  
    // Method to get weather information from the API
    async getWeather(x, y) {
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
      }
    }
  
    // Method to fetch a random Pokemon from the PokeAPI
    getPokemon() {
      // Make a fetch request to the Pokemon API (PokeAPI)
      fetch('https://pokeapi.co/api/v2/pokemon/1/') // You can change the endpoint for a different Pokemon
        .then(response => response.json())
        .then(data => {
          // Log the Pokemon API response
          console.log("Pokemon API Response:", data);
  
          // Check if the necessary data is available in the response
          if (data && data.name && data.sprites && data.sprites.front_default) {
            // Extract Pokemon details
            const pokemonName = data.name;
            const pokemonImage = data.sprites.front_default;
  
            // Display the Pokemon details on the HTML page (you may customize this part)
            document.getElementById('pokemon-name').innerText = `Pokemon: ${pokemonName}`;
            document.getElementById('pokemon-image').src = pokemonImage;
  
            // Log the extracted Pokemon details
            console.log("Pokemon Name:", pokemonName);
            console.log("Pokemon Image:", pokemonImage);
          } else {
            // Log an error if the response structure is not as expected
            console.error("Invalid Pokemon API Response:", data);
          }
        })
        .catch(error => console.log(error));
    }
  
    // Callback method for handling geolocation errors
    errorLocation(error) {
      console.log(error);
    }
  }
  
  // Run the app after the DOM has fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    const app = new App();
  });
  