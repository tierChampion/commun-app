import React, { useState, useEffect } from "react";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import ControlCameraRoundedIcon from "@mui/icons-material/ControlCameraRounded";

import Axios from "axios";
import "./inhabitant.css";
import { toPixelSpace, toMapSpace, clamp } from "./spaceChanges";

/**
 * TODO in here:
 *
 * - Highlight the character that is hovered over?
 * - Make the functionality to add the character that was said hello to in a list to not say hello multiple times to the same person
 * - Make the visuals better fit with different scales.
 *
 */

/**
 * An inhabitant with all of its functionalities and options
 * @param {*} props
 * @returns inhabitant react component
 */
function Inhabitant(props) {
  /**
   * Calculate the width of a piece of text on the viewport.
   * @param {string} text
   * @returns {float} width of the text in pixels
   */
  const calculateTextWidth = (text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = getComputedStyle(document.body).font;
    return context.measureText(text).width;
  };

  /// Dimensions ///
  const INHABITANT_DIMS = props.characterSize;
  const BUBBLE_WIDTH = 30 + calculateTextWidth(props.userName);
  const BUTTON_DIMS = clamp(20 * props.zoom, 90, 40);

  /// Positions ///
  const [x, setX] = useState();
  const [y, setY] = useState();

  /**
   * Hook to modify the character position when zooming and moving on the map.
   */
  useEffect(() => {
    var pos = toPixelSpace(props.x, props.y, props.center, props.zoom, [
      document.getElementById("Map").clientWidth,
      document.getElementById("Map").clientHeight,
    ]);

    setX(pos[0]);
    setY(pos[1]);
  }, [props.center, props.zoom]);

  /// Flags for the different options ///
  const [isFocused, setFocusing] = useState(false);
  const [spokenTo, setSpokenTo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  /**
   * Api call to say hello. Shows the message for two seconds.
   * @param {int} id Number associated with the proper inhabitant to say hello to.
   */
  const sayHello = (id) => {
    Axios.post("http://localhost:3001/api/hello", { id: id }).then(() => {
      setIsSpeaking(true);

      setTimeout(() => {
        setIsSpeaking(false);
      }, 2000);
    });
  };

  /**
   * Api call to change the position of the inhabitant in the database.
   * @param {int} id
   * @param {float} x
   * @param {float} y
   */
  const moveInhabitant = (id, x, y) => {
    Axios.post("http://localhost:3001/api/move", {
      id: id,
      x: x,
      y: y,
    });
  };

  /**
   * Sets the on screen position of the character to the cursor.
   * @param {*} cursorX
   * @param {*} cursorY
   */
  const positionToCursor = (cursorX, cursorY) => {
    setX(
      cursorX -
        document.getElementById("Map").offsetLeft -
        0.5 * INHABITANT_DIMS * props.zoom
    );
    // mouse position - map top position - 0.5 character size
    setY(
      cursorY -
        document.getElementById("Map").offsetTop -
        0.5 * INHABITANT_DIMS * props.zoom
    );
  };

  /**
   * Move the character and make him follow the mouse.
   */
  const followMouse = (e) => {
    setIsMoving(true);
    setSpokenTo(false);
    setIsSpeaking(false);
    setFocusing(false);

    positionToCursor(e.clientX, e.clientY);
  };

  return (
    <div className="inhabitant" style={{ left: x, top: y }}>
      {/* Username bubble */}
      {isFocused && (
        <div style={{ opacity: 0.5 }}>
          <div
            className="bubble not-selectable"
            style={{
              left: (INHABITANT_DIMS / 2) * props.zoom - BUBBLE_WIDTH / 2, // x - 0.5 character size - 0.5 bubble width
              width: BUBBLE_WIDTH,
              borderRadius: 8,
            }}
          >
            {props.userName}
          </div>
        </div>
      )}
      {/* Inhabitant */}
      <EmojiPeopleRoundedIcon
        className="clickable"
        style={{
          position: "absolute",
          width: INHABITANT_DIMS * props.zoom,
          height: INHABITANT_DIMS * props.zoom,
        }}
        onMouseDown={(e) => {
          if (e.button === 0) {
            e.stopPropagation();
            setSpokenTo(!spokenTo);
          }
        }}
        onMouseEnter={() => {
          if (!isMoving) setFocusing(true);
        }}
        onMouseLeave={() => {
          setFocusing(false);
        }}
      />
      {isMoving && (
        <div
          className="movement-plane"
          onMouseMove={(e) => {
            if (isMoving) {
              positionToCursor(e.clientX, e.clientY);
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsMoving(false);

            var pos = toMapSpace(
              x,
              y,
              [
                document.getElementById("Map").clientWidth,
                document.getElementById("Map").clientHeight,
              ],
              props.center,
              props.zoom
            );

            moveInhabitant(props.personId, pos[0], pos[1]);
          }}
        />
      )}
      {/* Say hello button and move button */}
      {spokenTo && (
        <>
          <HandshakeRoundedIcon
            className="clickable soft-appear"
            style={{
              // maybe change the size a little bit with scale so the buttons aren't super huge
              position: "absolute",
              width: BUTTON_DIMS,
              height: BUTTON_DIMS,
              left: INHABITANT_DIMS * props.zoom, // character size plus extra of 0.5 size
              top: 10 * props.zoom, // extra of 0.5 size
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              sayHello(props.personId);
              setSpokenTo(false);
            }}
          />
          <ControlCameraRoundedIcon
            className="clickable soft-appear"
            style={{
              // maybe change the size a little bit with scale so the buttons aren't super huge
              position: "absolute",
              alignSelf: "right",
              width: BUTTON_DIMS,
              height: BUTTON_DIMS,
              left: -BUTTON_DIMS, // about -1.5 size (less to account for asymmetry)
              top: 10 * props.zoom, // extra of 0.5 size
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              followMouse(e);
            }}
          />
        </>
      )}
      {/* Hello message when pressing the hello button */}
      {isSpeaking && (
        <span
          className="appear-disappear"
          style={{
            position: "absolute",
            top: INHABITANT_DIMS * props.zoom,
            left:
              (INHABITANT_DIMS / 2) * props.zoom -
              calculateTextWidth("Hello") / 2,
          }}
        >
          Hello
        </span>
      )}
    </div>
  );
}

export default Inhabitant;
