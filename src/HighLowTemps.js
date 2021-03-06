import React, { Component } from 'react'
import "./detailsPage.css";

class App extends Component {
    state = {
      loading: true,
      weather: null
    };
  
    async componentDidMount() { // Fetches and stores the highest and lowest temps of a given day.
      window.locale = 0;
  
      if ("geolocation" in navigator) {
        console.log("Available");
        navigator.geolocation.getCurrentPosition(
          function(position) {
            // console.log("Latitude is :", position.coords.latitude);
            // console.log("Longitude is :", position.coords.longitude);
            localStorage.setItem('lat', position.coords.latitude);
            localStorage.setItem('lon', position.coords.longitude);
            window.locale = 1;
          },
          function(error) {
            console.error("Error Code = " + error.code + " - " + error.message);
          }
        );
      } else {
        console.log("Not Available");
      }
      var lat = localStorage.getItem('lat');
      var lon = localStorage.getItem('lon');
      // console.log(lat)
      // console.log(lon)
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      window.count = urlParams.get('cnt')
      console.log(window.count);
      var url = ""
      if (window.count == 1) {
        url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=0002ba6db11e43059c746878dacce316&units=metric";
      } else {
        url = "https://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + lon + "&cnt=16&appid=0002ba6db11e43059c746878dacce316&units=metric";
      }
      const newurl = url
      console.log(newurl)
      const response = await fetch(url);
      const data = await response.json();
      this.setState({ weather: data, loading: false });
    }
  
    render() {
      if (window.locale == 0) {
        return <div>Please enable location services and make sure browser has access to it</div>;
      }
  
      if (this.state.loading) {
        return <div>loading...</div>;
      }
  
      if (!this.state.weather) {
        return <div>didn't recieve weather information</div>;
      }

      // based off the parameter Count, the max and min temperatures are accessed from the correct API
      // it is then assigned to the appropriate variable
      var hightemp = 0;
      var lowtemp = 0;

      if (window.count == 1) {
        hightemp = Math.round(this.state.weather.main.temp_max);
        lowtemp = Math.round(this.state.weather.main.temp_min);
      } else {
        hightemp = Math.round(this.state.weather.list[(window.count - 1)].temp.max);
        lowtemp = Math.round(this.state.weather.list[(window.count - 1)].temp.min);
      }
      return (
        <div className="highhh">
            <p className="highlowtemp">H: {hightemp}<sup>&#176;C</sup></p>
            <p className="highlowtemp">L: {lowtemp}<sup>&#176;C</sup></p>
        </div>
      )
    }
  }
  
  export default App;