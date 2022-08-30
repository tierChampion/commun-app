import React from "react";
import Axios from "axios";
import "./app.css";
import TownMap from "./townMap";

/**
 * --> TODOS:
 *
 * + Add a drag event for additional mouvement
 * + Fix the visuals for the inhabitants
 * -> Animate a fadein and move for the username and hello button
 *
 * + Add accounts to make the characters unique
 * -> Add somekind of menu to log in / create an account
 * -> Generate a password to identify and log in later
 * -> Add move option for your inhabitant
 * -> Add custom message that you can place on your character to say instead of hello (or with)
 * -> Limit the number of hellos with a cap and no duplicate hellos on one guy
 * -> Keep the people helloed in memory (db)
 *
 */

function App() {
  /**
   * Api call to remove all positions from database.
   */
  const clearPositions = () => {
    Axios.post("http://localhost:3001/api/reset");
  };

  return (
    <div className="App">
      <h1>commun</h1>
      <div className="Options">
        <div className="Buttons">
          <button onClick={clearPositions}>Clear table</button>
        </div>
        <TownMap />
      </div>
    </div>
  );
}

export default App;
