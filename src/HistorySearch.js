import React from 'react';
import "./App.css";
import { useState } from 'react';
import {
    useHistory
  } from "react-router-dom";


// Allows the user to search for predictions of a chosen date, which will use historical data to calculate average values to show to the user
export default function HistorySearch() {
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");

    const history = useHistory();
  
    const handleSubmit = () => {
        history.push({
          pathname: '/history',
          search: `?month=${month}&day=${day}`
      })
    }
  return (
    <form>
        <fieldset className = 'searchForm'>
          <div className='searchTexts'>
              <input type = 'number' min = '1' max = '31' value = {day} onChange = {(e) => setDay(e.target.value)} className = 'searchText' placeholder='Day' required/><br/>
              <input type = 'number' min = '1' max = '12' value = {month} onChange = {(e) => setMonth(e.target.value)} className = 'searchText' placeholder='Month' required/><br/>
          </div>    
            <input type = 'submit' onClick = {handleSubmit} className = 'searchSubmit' value='Search' />
        </fieldset>
    </form>
  )
}