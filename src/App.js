export default class App {
    constructor() {
        this.getLocation();
        this.gotLocation = this.gotLocation.bind(this);
        this.errorLocation = this.errorLocation.bind(this);
        this.getWeather = this.getWeather.bind(this); // Bind the getWeather method
    }


    getLocation() {
        navigator.geolocation.getCurrentPosition(this.gotLocation, this.errorLocation);
        
    }


    gotLocation(result) {
        console.log(result);
        let x = result.coords.latitude; // Use result.coords.latitude instead of position.coords.latitude
        let y = result.coords.longitude; // Use result.coords.longitude instead of position.coords.longitude
        this.getWeather(x, y);
    }

    getWeather(x,y) {
        //url: https://api.open-meteo.com/v1/forecast?latitude=51.0289&longitude=4.4779&hourly=temperature_2m&forecast_days=1
        // fetch, then log result
        
        fetch('https://api.open-meteo.com/v1/forecast?latitude='+x+'&longitude='+y+'&hourly=temperature_2m&forecast_days=1')
        .then(response => response.json())
        .then(data => {
            document.querySelector('h2').innerHTML = data.current_weather.temperature;
                data.current_weather.temperature + "°C"
            console.log(data)}) // hier komt json binnen dus daar kunnen we hem loggen
       
            .catch(error => console.log(error));


    }

    // showError (error)
    errorLocation(error) {
        console.log(error);
    }



}