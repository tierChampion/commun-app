import React, { useState, useEffect } from "react";
import { HouseRounded } from "@material-ui/icons";
import Axios from "axios";
import "./App.css";

// todo => hide links in server calls

// front end (material design ?)

function App() {
  const [trees, setTrees] = useState([]);

  const HOUSE_DIM = 50;

  /*
  Calculates the position to send to the database
  */
  const calculatePosition = (event) => {
    var newX = event.clientX - event.target.offsetLeft;
    var newY = event.clientY - event.target.offsetTop;

    // Send position in screen percentage
    sendPosition(
      newX / event.target.clientWidth,
      newY / event.target.clientHeight
    );
  };

  /*
  Converts from screen percentage to pixel position
  */
  const positionToPixels = (posX, posY) => {
    var x = posX * document.getElementById("Map").clientWidth;
    var y = posY * document.getElementById("Map").clientHeight;

    return [x - HOUSE_DIM / 2, y - HOUSE_DIM / 2];
  };

  /*
  Initial filling of the screen
  */
  useEffect(() => {
    getPositions();
  }, []);

  const sendPosition = (x, y) => {
    // todo
    Axios.post("http://localhost:3001/api/insert", { x: x, y: y }).then(
      (response) => {
        setTrees((old) => [...old, response.data]);
      }
    );
  };

  const getPositions = () => {
    // todo
    Axios.get("http://localhost:3001/api/get").then((response) => {
      setTrees(response.data);
    });
  };

  const clearPositions = () => {
    // todo
    Axios.post("http://localhost:3001/api/reset").then((response) => {
      setTrees([]);
    });
  };

  return (
    <div className="App">
      <h1>commun</h1>

      <div className="Options">
        <div className="Buttons">
          <button onClick={clearPositions}>Clear table</button>
        </div>
        <div id="Map" className="Map" onMouseDown={calculatePosition}>
          {trees.map((tree) => {
            var pos = positionToPixels(tree.x, tree.y);

            return (
              <HouseRounded
                className="not-selectable"
                key={tree.id}
                style={{
                  color: "white",
                  position: "absolute",
                  left: pos[0],
                  top: pos[1],
                  width: HOUSE_DIM,
                  height: HOUSE_DIM,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
