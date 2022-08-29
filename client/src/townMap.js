import React, { useState, useEffect } from "react";
import Axios from "axios";

import "./app.css";
import Inhabitant from "./inhabitant";

function TownMap() {
  const [inhabitants, setInhabitants] = useState([]);

  /**
   * Zooming parameters
   */
  const MAX_ZOOM = 5;
  const MIN_ZOOM = 0.1;
  const [corner, setCorner] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);

  const PEOPLE_DIM = 50;

  /**
   * Initial filling of the screen with the raw data.
   */
  useEffect(() => {
    getPositions();
  }, []);

  const clamp = (val, max, min) => {
    return Math.min(Math.max(val, min), max);
  };

  /**
   * Api call to read positions from database
   */
  const getPositions = () => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      setInhabitants(response.data);
    });
  };

  /**
   * Api call to add position to database.
   * @param {float} x
   * @param {float} y
   */
  const sendPosition = (x, y) => {
    Axios.post("http://localhost:3001/api/insert", { x: x, y: y }).then(
      (response) => {
        setInhabitants((old) => [...old, response.data]);
      }
    );
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

    return [x - (PEOPLE_DIM * zoom) / 2, y - (PEOPLE_DIM * zoom) / 2];
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

  return (
    <div
      id="Map"
      className="Map"
      onMouseDown={calculatePosition}
      onWheel={zoomIn}
    >
      {inhabitants.map((inhabitant) => {
        var pos = positionToPixels(inhabitant.x, inhabitant.y);

        return (
          <Inhabitant
            key={inhabitant.id}
            personId={inhabitant.id}
            userName={"running away in what seems like yogurt"}
            size={PEOPLE_DIM}
            x={pos[0]}
            y={pos[1]}
            zoom={zoom}
          />
        );
      })}
    </div>
  );
}

export default TownMap;
