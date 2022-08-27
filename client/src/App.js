import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import Inhabitant from "./Inhabitant";

/**
 * Brainstorm ideas:
 *
 * Add accounts
 * Make your character be able to move when clicking on him
 * Have a counter for how many hellos people receive
 * be able to give hellos to other when clicking on them
 * maybe have a friends list which gives hearts to friends?
 */

/**
 * --> TODOS:
 *
 * + Add a drag event
 * + Add a click event on the characters to show the menu to speak to him
 * +
 * + Add accounts to make the characters unique
 * + Implement the hello functionnalities
 * ...
 *
 */

function App() {
  // Raw Data
  const [trees, setTrees] = useState([]);

  /**
   * Zooming parameters
   */
  const MAX_ZOOM = 5;
  const MIN_ZOOM = 0.1;
  const [corner, setCorner] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);

  const USER_DIM = 50;

  const clamp = (val, max, min) => {
    return Math.min(Math.max(val, min), max);
  };

  /**
   * Zooming event on the map.
   * @param event React mouse roll event
   */
  const zoomIn = (event) => {
    // Zooming
    var scrollDelta = -event.deltaY;
    var newZoom = zoom + (scrollDelta > 0 ? 0.1 : -0.1) * zoom;
    setZoom(clamp(newZoom, MAX_ZOOM, MIN_ZOOM));

    // Setting the corner of the screen
    var x = event.clientX - event.target.offsetLeft;
    var y = event.clientY - event.target.offsetTop;

    var screenX = x / event.target.clientWidth;
    var screenY = y / event.target.clientHeight;

    var pixelX = screenX / zoom + corner[0];
    var pixelY = screenY / zoom + corner[1];

    setCorner([
      clamp(pixelX - 0.5 / zoom, 1 / MIN_ZOOM - 1 / zoom, 0),
      clamp(pixelY - 0.5 / zoom, 1 / MIN_ZOOM - 1 / zoom, 0),
    ]);
  };

  /**
   * Calculates the position to send to the database
   * @param event React click mouse event
   */
  const calculatePosition = (event) => {
    var x = event.clientX - event.target.offsetLeft;
    var y = event.clientY - event.target.offsetTop;

    var screenX = x / event.target.clientWidth;
    var screenY = y / event.target.clientHeight;

    // Send position in screen percentage
    sendPosition(screenX / zoom + corner[0], screenY / zoom + corner[1]);
  };

  /**
   * Converts from screen percentage to pixel position
   * @param {int} posX Lateral position in pixels
   * @param {int} posY Vertical position in pixels
   */
  const positionToPixels = (posX, posY) => {
    var remappedX = (posX - corner[0]) * zoom;
    var remappedY = (posY - corner[1]) * zoom;

    var x = remappedX * document.getElementById("Map").clientWidth;
    var y = remappedY * document.getElementById("Map").clientHeight;

    return [x - (USER_DIM * zoom) / 2, y - (USER_DIM * zoom) / 2];
  };

  /**
   * Initial filling of the screen with the raw data.
   */
  useEffect(() => {
    getPositions();
  }, []);

  /**
   * Api call to add position to database.
   * @param {float} x
   * @param {float} y
   */
  const sendPosition = (x, y) => {
    Axios.post("http://localhost:3001/api/insert", { x: x, y: y }).then(
      (response) => {
        setTrees((old) => [...old, response.data]);
      }
    );
  };

  /**
   * Api call to read positions from database
   */
  const getPositions = () => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      setTrees(response.data);
    });
  };

  /**
   * Api call to remove all positions from database.
   */
  const clearPositions = () => {
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
        <div
          id="Map"
          className="Map"
          onMouseDown={calculatePosition}
          onWheel={zoomIn}
        >
          {trees.map((tree) => {
            var pos = positionToPixels(tree.x, tree.y);

            // put inside div that positions properly than have person and text inside that div
            // remove the redundance of the similar styles

            return (
              <Inhabitant
                key={tree.id}
                size={USER_DIM}
                x={pos[0]}
                y={pos[1]}
                zoom={zoom}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
