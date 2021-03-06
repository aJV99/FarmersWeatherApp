import React, { Component } from 'react';
import Todate from './Todate';
import Currentemp from './Currentemp';
import Circles from './Circles';
import Navbar from './Navbar';
import Tiles from './Tiles';
import Location from './Location';
import Days from './Days';
import Header from './Header';
import HistoryHeader from './HistoryHeader';
import HistorySearch from './HistorySearch';
import "./detailsPage.css";
import Datetimetemp from "./Datetimetemp";
import HighLowTemps from "./HighLowTemps";
import InfoTable from "./InfoTable";
import TempInfo from "./TempInfo";
import SunRiseSet from "./SunRiseSet";
import Status from "./Status";
import HistoryDateTemp from "./HistoryDateTemp";
import HistoryHighLow from "./HistoryHighLow";
import HistoryInfoTable from "./HistoryInfoTable";
import "./App.css"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// dynamic background function to change the background image based on the different weather conditions
function weatherBackg(desc) {  
  if (desc === "Clear") {
    return "page-clear";
  }
  else if (desc === "Thunderstorm") {
    return "page-thunderstorm";
  }
  else if (desc === "Snow") {
    return "page-snow";
  }
  else if (desc === "Rain") {
    return "page-rain";
  }
  else {
    return "page-clouds";
  }
}

class App extends Component {
  // the below API call code is similar throughout all the pages which perform API calls
  // the main comments for API are here

  // declare two states; loading and weather.
  // loading is a boolean and if false, it means data has been recieved by the weather state.
  state = {
    loading: true,
    weather: null
  };
 
  async componentDidMount() {
    window.locale = 0;

    if ("geolocation" in navigator) {  // checks if geolocation is enabled.
      console.log("Available");
      
      // the below code grabs the longitude and latitude from the current location
      // and sets that data in the local storage.
      navigator.geolocation.getCurrentPosition(
        function (position) {
          localStorage.setItem('lat', position.coords.latitude);
          localStorage.setItem('lon', position.coords.longitude);
          window.locale = 1;
          console.log(window.locale);
        },
        function (error) { // in case of error whilst getting current location
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    } else {
      console.log("Not Available");
    }
    var lat = localStorage.getItem('lat');
    var lon = localStorage.getItem('lon');
    console.log(lat)
    console.log(lon)

    // the below URL is the API url containing longitude and latitude and the API key.
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=0002ba6db11e43059c746878dacce316&units=metric";
    
    // the code then fetches the json data from the URL and assigns it to the weather state as data
    // and then it sets the loading state to false.
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ weather: data, loading: false });
    console.log(url);
    console.log(this.state.weather.weather[0].main);
  }
  render() {
    // this checks weather the geolocation services of the device are enabled
    // and whether the browser has access to it.
    // it displays an error if the above is false. 
    if (window.locale == 0) {
      return <div>Please enable location services and make sure browser has access to it</div>;
    }

    if (this.state.loading) {
      return <div>loading...</div>;
    }

    if (!this.state.weather) {
      return <div>didn't recieve weather information</div>;
    }

    var descr = this.state.weather.weather[0].main;
    return (
      <Router>
        {/* the below code runs the dynamic background function to change the CSS code */}
        <div className={weatherBackg(descr)}>
          <Switch>
            {/* the below route is for the Home page which contains its components */}
            <Route exact path='/'>
              <Link to="/info?cnt=1">
                <Todate />
                <Currentemp />
                <Circles />
              </Link>
              <Tiles />
              <Location />
            </Route>
            {/* the below route is for the Sixteen Day Forecast page which contains its components */}
            <Route exact path='/sixteen'>
              <Header />
              <Days />
            </Route>
            {/* the below route is for the page which contains the components which display the Sixteen Page Forecast results */}
            {/* it is alsp for the page which contains the components which displays the current forecast data */}
            <Route exact path='/info'>
              <Datetimetemp />
              <HighLowTemps />
              <Status />
              <SunRiseSet />
              <TempInfo />
              <InfoTable />
            </Route>
            {/* the below route is for the Statistical Prediction Search page which contains its components */}
            <Route exact path='/search'>
              <HistoryHeader />
              <HistorySearch />
            </Route>
            {/* the below route is for the page which contains the components which display the Statistical Prediction Search results */}
            <Route exact path='/history'>
              <HistoryDateTemp />
              <HistoryHighLow />
              <HistoryInfoTable />
            </Route>
          </Switch>
          <Navbar />
        </div>
      </Router>
    )
  }
}
export default App;
