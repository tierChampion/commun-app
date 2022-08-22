import React, { useState, useEffect } from "react";
import { EmojiPeopleRounded } from "@material-ui/icons";
import Axios from "axios";
import "./App.css";

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
 * + Add a buble for the username of the characters
 * + Add accounts to make the characters unique
 * + Implement the hello functionnalities
 * ...
 *
 */

function App() {
  const [trees, setTrees] = useState([]);

  const [center, setCenter] = useState([0.5, 0.5]);

  const [zoom, setZoom] = useState(1);

  const USER_DIM = 50;
  const MAX_ZOOM = 1;
  const MIN_ZOOM = 0.1;

  const zoomIn = (event) => {
    console.log(event);

    var x = event.clientX - event.target.offsetLeft;
    var y = event.clientY - event.target.offsetTop;

    var screenX = x / event.target.clientWidth;
    var screenY = y / event.target.clientHeight;

    // Send position in screen percentage
    /*
    setCenter([
      (screenX - 0.5) / zoom + center[0],
      (screenY - 0.5) / zoom + center[1],
    ]);
    */
    var delta = -event.deltaY;

    var newZoom = zoom + (0.01 * delta) / (MAX_ZOOM - zoom);

    if (newZoom < MIN_ZOOM && delta < 0) {
      newZoom = MIN_ZOOM;
    } else if (newZoom > MAX_ZOOM && delta > 0) {
      newZoom = MAX_ZOOM;
    }

    // Event works just
    /*
    setZoom(newZoom);
    */
  };

  /*
  Calculates the position to send to the database
  */
  const calculatePosition = (event) => {
    var x = event.clientX - event.target.offsetLeft;
    var y = event.clientY - event.target.offsetTop;

    var screenX = x / event.target.clientWidth;
    var screenY = y / event.target.clientHeight;

    // Send position in screen percentage
    sendPosition(
      (screenX - 0.5) / zoom + center[0],
      (screenY - 0.5) / zoom + center[1]
    );
  };

  /*
  Converts from screen percentage to pixel position
  */
  const positionToPixels = (posX, posY) => {
    var remappedX = (posX - center[0]) * zoom + 0.5;
    var remappedY = (posY - center[1]) * zoom + 0.5;

    var x = remappedX * document.getElementById("Map").clientWidth;
    var y = remappedY * document.getElementById("Map").clientHeight;

    return [x - (USER_DIM * zoom) / 2, y - (USER_DIM * zoom) / 2];
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
        <div
          id="Map"
          className="Map"
          onMouseDown={calculatePosition}
          onWheel={zoomIn}
        >
          {trees.map((tree) => {
            var pos = positionToPixels(tree.x, tree.y);

            return (
              <>
                <div
                  className="not-selectable"
                  key={tree.id}
                  style={{
                    color: "white",
                    position: "absolute",

                    left: pos[0],
                    top: pos[1],
                    width: 0,
                    height: 0,
                  }}
                >
                  hello
                </div>
                <EmojiPeopleRounded
                  className="not-selectable"
                  key={tree.id}
                  style={{
                    color: "white",
                    position: "absolute",
                    left: pos[0],
                    top: pos[1],
                    width: USER_DIM * zoom,
                    height: USER_DIM * zoom,
                  }}
                />
              </>
            );
            //}
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
