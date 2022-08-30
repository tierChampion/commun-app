import React, { useState } from "react";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";

import Axios from "axios";
import "./inhabitant.css";

/**
 * TODO in here:
 *
 * - Animate the different components
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
  const BUBBLE_HEIGHT = 30;

  // Flags for the different options
  const [isFocused, setFocusing] = useState(false);
  const [spokenTo, setSpokenTo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  return (
    <div className="inhabitant" style={{ left: props.x, top: props.y }}>
      {/* Username bubble */}
      {isFocused && (
        <div style={{ opacity: 0.5 }}>
          <div
            className="not-selectable"
            style={{
              color: "rgb(0, 0, 0, 255)",
              backgroundColor: "grey",
              position: "absolute",
              textAlign: "center",
              left: (INHABITANT_DIMS / 2) * props.zoom - BUBBLE_WIDTH / 2,
              top: -BUBBLE_HEIGHT,
              width: BUBBLE_WIDTH,
              height: BUBBLE_HEIGHT,
              borderRadius: 8,
            }}
          >
            {props.userName}
          </div>
        </div>
      )}
      {/* Inhabitant */}
      <EmojiPeopleRoundedIcon
        className="character"
        style={{
          position: "absolute",
          width: INHABITANT_DIMS * props.zoom,
          height: INHABITANT_DIMS * props.zoom,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setSpokenTo(!spokenTo);
        }}
        onMouseEnter={() => setFocusing(true)}
        onMouseLeave={() => {
          setFocusing(false);
        }}
      />
      {/* Say hello button */}
      {spokenTo && (
        <HandshakeRoundedIcon
          className="character"
          style={{
            position: "absolute",
            left: 10 + INHABITANT_DIMS,
            top: 10,
            backgroundColor: "rgb(100, 100, 100, 100)",
            borderRadius: 10,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            sayHello(props.personId);
            setSpokenTo(false);
          }}
        />
      )}
      {/* Hello message when pressing the hello button */}
      {isSpeaking && (
        <span
          style={{
            position: "absolute",
            top: INHABITANT_DIMS,
          }}
        >
          Hello
        </span>
      )}
    </div>
  );
}

export default Inhabitant;
