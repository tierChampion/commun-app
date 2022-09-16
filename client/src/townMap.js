import React, { useState, useEffect } from "react";
import Axios from "axios";

import "./townMap.css";
import Inhabitant from "./inhabitant";
import { toMapSpace, clamp } from "./spaceChanges";

/**
 * TODO here:
 *
 * - Fix the wheel scroll event. Make the middle not move to fast to the mouse
 * - Maybe change the visuals a bit of the map (make it not so monochrome add color ?)
 * - Probably in the app, but find a way to keep the current user in check (accounts)
 */

function TownMap() {
  const [inhabitants, setInhabitants] = useState([]);

  /**
   * Zooming parameters
   */
  const MAX_ZOOM = 5;
  const MIN_ZOOM = 0.1;
  const [corner, setCorner] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);

  const PEOPLE_DIM = 50;

  /**
   * Initial filling of the screen with the raw data.
   */
  useEffect(() => {
    getPositions();
  }, []);

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
   * Zooming event on the map.
   * @param event React mouse roll event
   */
  const zoomIn = (event) => {
    // Zooming
    var scrollDelta = -event.deltaY;
    var newZoom = zoom + (scrollDelta > 0 ? 0.05 : -0.05) * zoom;
    setZoom(clamp(newZoom, MAX_ZOOM, MIN_ZOOM));

    // Setting the corner of the screen
    var x = event.clientX - document.getElementById("Map").offsetLeft;
    var y = event.clientY - document.getElementById("Map").offsetTop;

    var newCenter = toMapSpace(
      x,
      y,
      [
        document.getElementById("Map").clientWidth,
        document.getElementById("Map").clientHeight,
      ],
      corner,
      zoom
    );

    // move slowly to newcenter, interpolate between the centers

    setCorner([
      clamp(newCenter[0] - 0.5 / zoom, 1 / MIN_ZOOM - 1 / zoom, 0),
      clamp(newCenter[1] - 0.5 / zoom, 1 / MIN_ZOOM - 1 / zoom, 0),
    ]);
  };

  const dragMove = (event) => {
    console.log(event);
    setCorner([
      clamp(
        corner[0] -
          event.movementX / document.getElementById("Map").clientWidth,
        1 / MIN_ZOOM - 1 / zoom,
        0
      ),
      clamp(
        corner[1] -
          event.movementY / document.getElementById("Map").clientHeight,
        1 / MIN_ZOOM - 1 / zoom,
        0
      ),
    ]);
  };

  /**
   * Calculates map space position. Converts from pixel position to screen percentage.
   * @param event React click mouse event
   * @return position in map space
   */
  const calculatePosition = (event) => {
    var x = event.clientX - event.target.offsetLeft;
    var y = event.clientY - event.target.offsetTop;

    return toMapSpace(
      x,
      y,
      [event.target.clientWidth, event.target.clientHeight],
      corner,
      zoom
    );
  };

  return (
    <div
      id="Map"
      className="town-map"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onMouseDown={(e) => {
        // left click
        if (e.button === 0) {
          let pos = calculatePosition(e);
          sendPosition(pos[0], pos[1]);
          // other clicks
        } else {
          setDragging(true);
        }
      }}
      onMouseUp={() => setDragging(false)}
      onWheel={(e) => {
        e.stopPropagation();
        zoomIn(e);
      }}
      onMouseMove={(e) => {
        if (dragging) dragMove(e);
      }}
    >
      {inhabitants.map((inhabitant) => {
        return (
          <Inhabitant
            key={inhabitant.id}
            personId={inhabitant.id}
            userName={"wat da dog doin?"}
            characterSize={PEOPLE_DIM}
            x={inhabitant.x}
            y={inhabitant.y}
            corner={corner}
            zoom={zoom}
          />
        );
      })}
    </div>
  );
}

export default TownMap;
