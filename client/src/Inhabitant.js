import React, { useState, useEffect } from "react";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import ControlCameraRoundedIcon from "@mui/icons-material/ControlCameraRounded";

import Axios from "axios";
import "./inhabitant.css";
import { toPixelSpace, toMapSpace } from "./spaceChanges";

/**
 * TODO in here:
 *
 * - Upgrade the visuals of the hello text and the other options (etc.)
 * - Make the functionality to add the character that was said hello to in a list
 * - Add a drag event to move the inhabitant (possibly restrain it after to only your character)
 *    => maybe have it on the right click so as to not clash with other stuff
 * <Check if operations in the database are atomic or if multiple users need to be carefully managed>
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

  // Dimensions
  const INHABITANT_DIMS = props.characterSize;
  const BUBBLE_WIDTH = 30 + calculateTextWidth(props.userName);

  // Position

  const [x, setX] = useState();
  const [y, setY] = useState();

  // Change position when rerendering by zooming
  useEffect(() => {
    var pos = toPixelSpace(props.x, props.y, props.corner, props.zoom, [
      document.getElementById("Map").clientWidth,
      document.getElementById("Map").clientHeight,
    ]);

    setX(pos[0]);
    setY(pos[1]);
  }, [props.corner, props.zoom]);

  // Flags for the different options
  const [isFocused, setFocusing] = useState(false);
  const [spokenTo, setSpokenTo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const onHover = (event) => {
    if (!isMoving) setFocusing(true);
  };

  /**
   * Api call to say hello
   * @param {int} id Number associated with the proper inhabitant to say hello to.
   */
  const sayHello = (id) => {
    Axios.post("http://localhost:3001/api/hello", { id: id }).then(() => {
      // Open the message and close it after two seconds (2000 milliseconds)
      setIsSpeaking(true);

      setTimeout(() => {
        setIsSpeaking(false);
      }, 2000);
    });
  };

  const moveInhabitant = (id, x, y) => {
    Axios.post("http://localhost:3001/api/move", {
      id: id,
      x: x,
      y: y,
    });
  };

  /**
   * Mouve the character
   * @param {*} event
   */
  const followMouse = (event) => {
    // add event listener for mouse position
    // once new position is found, change the info in the database

    // idea:
    // Make the character follow the mouse in a special state where no other option is shown and the hover is disabled
    // When the character register a click, instead of doing the usual, send the position to the database
    // During the hover, instead of doing the usual, modify x and y

    setIsMoving(true);
    setSpokenTo(false);
    setIsSpeaking(false);
    setFocusing(false);

    setX(x - 1.25 * INHABITANT_DIMS * props.zoom + 10);
  };

  return (
    <div className="inhabitant" style={{ left: x, top: y }}>
      {/* Username bubble */}
      {isFocused && (
        <div style={{ opacity: 0.5 }}>
          <div
            className="test not-selectable"
            style={{
              left: (INHABITANT_DIMS / 2) * props.zoom - BUBBLE_WIDTH / 2,
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
          e.stopPropagation();
          if (!isMoving) setSpokenTo(!spokenTo);
          else {
            setIsMoving(false);

            var pos = toMapSpace(
              x + 0.5 * INHABITANT_DIMS * props.zoom,
              y + 0.5 * INHABITANT_DIMS * props.zoom,
              [
                document.getElementById("Map").clientWidth,
                document.getElementById("Map").clientHeight,
              ],
              props.corner,
              props.zoom
            );

            moveInhabitant(props.personId, pos[0], pos[1]);
          }
        }}
        onMouseEnter={onHover}
        onMouseLeave={(e) => {
          setFocusing(false);
        }}
        onMouseMove={(e) => {
          if (isMoving) {
            setX(e.clientX - 0.5 * INHABITANT_DIMS * props.zoom);
            setY(e.clientY - 2 * INHABITANT_DIMS * props.zoom);
          }
        }}
      />
      {/* Say hello button and move button */}
      {spokenTo && (
        <>
          <HandshakeRoundedIcon
            className="clickable soft-appear"
            style={{
              position: "absolute",
              left: INHABITANT_DIMS * props.zoom + 10 * props.zoom,
              top: 10,
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
              position: "absolute",
              alignSelf: "right",

              left: -10,
              top: 10,
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
