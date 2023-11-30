// Import necessary modules or styles if any

// Define the App class
export default class App {
    // Constructor to initialize the app
    constructor() {
        // Bind methods to the current instance
        this.gotLocation = this.gotLocation.bind(this);
        this.errorLocation = this.errorLocation.bind(this);
        this.getWeather = this.getWeather.bind(this);
        this.getPokemon = this.getPokemon.bind(this); // Add Pokemon method

        // Trigger the geolocation request
        this.getLocation();
    }

    // Method to get the current geolocation
    getLocation() {
        navigator.geolocation.getCurrentPosition(this.gotLocation, this.errorLocation);
    }

    // Callback method when geolocation is obtained successfully
    gotLocation(result) {
        // Extract latitude and longitude from the result
        let x = result.coords.latitude;
        let y = result.coords.longitude;

        // Call the method to get weather information
        this.getWeather(x, y);
        this.getPokemon(); // Fetch Pokemon as well
    }

    // Method to get weather information from the API
    getWeather(x, y) {
        // Make a fetch request to the weather API (OpenWeatherMap or any other of your choice)
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${x}&longitude=${y}&hourly=temperature_2m&forecast_days=1`)
            .then(response => response.json())
            .then(data => {
                // Log the full API response
                console.log("Full API Response:", data);

                // Check if the necessary data is available in the response
                if (data && data.hourly && data.hourly.temperature_2m && data.hourly.temperature_2m.length > 0) {
                    // Extract the temperature value
                    const temperature = data.hourly.temperature_2m[0];

                    // Display the temperature on the HTML page with the thermometer emoji
                    document.querySelector('h2').innerHTML = `🌡️ ${temperature}°C`;

                    // Log the extracted temperature
                    console.log("Temperature:", temperature);
                } else {
                    // Log an error if the response structure is not as expected
                    console.error("Invalid API Response:", data);
                }
            })
            .catch(error => console.log(error));
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
