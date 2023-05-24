import React, { useEffect, useState } from "react";
import "./App.css";
//import timeImage from "./time.jpg";
import { populateMonths, populateDays, handleSubmit } from "./Utils";

function App() {
  const [isMonthsPopulated, setIsMonthsPopulated] = useState(false);

  useEffect(() => {
    if (!isMonthsPopulated) {
      populateMonths();
      setIsMonthsPopulated(true);
    }
  }, [isMonthsPopulated]);

  return (
    <div className="container">
      <h1 id="header">What time would you like to visit?</h1>

      <form action="">
        <select id="months" name="month" onChange={populateDays}>
          <option value="" disabled selected>
            Month
          </option>
        </select>

        <select id="days" name="day">
          <option value="" disabled selected>
            Day
          </option>
        </select>

        <button type="button" id="submit-button" onClick={handleSubmit}>
          Search
        </button>
      </form>
      <div id="output"></div>
      <div id="saved-events">SAVED EVENTS:</div>
    </div>
  );
}

export default App;
