import React, { useState, useEffect } from "react";
import Axios from "axios";

import "./townMap.css";
import Inhabitant from "./inhabitant";
import { toMapSpace, clamp } from "./spaceChanges";

/**
 * TODO here:
 *
 * - Maybe change the visuals a bit of the map (make it not so monochrome add color ?)
 * - Probably in the app, but find a way to keep the current user in check (accounts)
 *
 */

function TownMap() {
  const [inhabitants, setInhabitants] = useState([]);

  /**
   * Zooming parameters
   */
  const MAX_ZOOM = 5;
  const MIN_ZOOM = 0.1;
  const [center, setCenter] = useState([0.5, 0.5]);
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
    Axios.post("http://localhost:3001/api/insert", {
      x: clamp(x, 1 / MIN_ZOOM, 0),
      y: clamp(y, 1 / MIN_ZOOM, 0),
    }).then((response) => {
      setInhabitants((old) => [...old, response.data]);
    });
  };

  /**
   * Zooming event on the map.
   * @param event React mouse roll event
   */
  const zoomIn = (event) => {
    // Zooming
    var scrollDelta = -event.deltaY;
    var newZoom = zoom + (scrollDelta > 0 ? 0.05 : -0.05) * zoom;
    newZoom = clamp(newZoom, MAX_ZOOM, MIN_ZOOM);
    setZoom(newZoom);

    setCenter([
      clamp(center[0], 1 / MIN_ZOOM - 0.5 / newZoom, 0.5 / newZoom),
      clamp(center[1], 1 / MIN_ZOOM - 0.5 / newZoom, 0.5 / newZoom),
    ]);

    //console.log(zoom);
  };

  const dragMove = (event) => {
    setCenter([
      clamp(
        center[0] -
          event.movementX / document.getElementById("Map").clientWidth / zoom,
        1 / MIN_ZOOM - 0.5 / zoom,
        0.5 / zoom
      ),
      clamp(
        center[1] -
          event.movementY / document.getElementById("Map").clientHeight / zoom,
        1 / MIN_ZOOM - 0.5 / zoom,
        0.5 / zoom
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
      x - 0.5 * PEOPLE_DIM * zoom,
      y - 0.5 * PEOPLE_DIM * zoom,
      [event.target.clientWidth, event.target.clientHeight],
      center,
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
            center={center}
            zoom={zoom}
          />
        );
      })}
    </div>
  );
}

export default TownMap;
