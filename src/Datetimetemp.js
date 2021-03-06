import React, { Component } from 'react'
import "./detailsPage.css";

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var day = weekdays[a.getDay()];
  var date = dateEnd(a.getDate());
  var time = day + ' ' + date + ' ' + month + ' ' + year;
  return time;  
}

var weekdays=new Array(7);  // To store the days of the week
weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dateEnd(date) {
  if (date == 1 || date == 21 || date == 31) {
    return date + "st";
  } else if (date == 2 || date == 22) {
    return date + "nd";
  } else if (date == 3 || date == 23) {
    return date + "rd";
  } else {
    return date + "th";
  }
}

var months=new Array(7); // To store the months
months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class App extends Component {
    state = {
      loading: true,
      weather: null
    };
  
    async componentDidMount() {
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

      // the below code takes parameters from the URL sent from the previous page
      // this helps the code with search parameters to know what to call from the API
      // similar code has been implemented on various pages and thus, comments won't be repeated
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      window.count = urlParams.get('cnt')
      console.log(window.count);

      // this component, when accessed, can retrieve data from two different API's based off the parameter
      // if the parameter Count is 1, then it takes data from the Current Temperature API
      // otherwise, it takes data from the 16 Day Forecast API
      // similar code has been implemented on various pages and thus, comments won't be repeated
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

      if (window.count == 1) { // For rendering weather services on the browser according to current location
        const current = new Date();
        var date = weekdays[`${current.getDay()}`] + " " + dateEnd(`${current.getDate()}`) + " " + months[`${current.getMonth()}`] + " " + `${current.getFullYear()}`;
        var time = ('0' + current.getHours()).slice(-2) + ':' + ('0' + current.getMinutes()).slice(-2);
        console.log(date);
        console.log(time);
        var temp = <div className='ahhh'><h1 className = "mainTemp">{Math.round(this.state.weather.main.temp)}<sup className='super'>&#176;C</sup></h1></div>
      } else {
        var date = timeConverter(this.state.weather.list[(window.count - 1)].dt)
        var temp = <div className='ahhh'><h1 className = "mainTemp2">average temp<br></br> {Math.round(this.state.weather.list[window.count - 1].temp.day)}<sup className='super'>&#176;C</sup></h1></div>
      }
      return (
        <div>
            {/* displays the date, time and temp */}
            {/* time isn't displayed if redirected from the Sixteen Forecast page */}
            <h2 className = "date">{date}</h2>
            <h2 className = "time">{time}</h2>
            {temp}
        </div>
      )
    }
  }
  
  export default App;