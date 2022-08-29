import React, { useState } from "react";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";

import Axios from "axios";
import "./inhabitant.css";

function Inhabitant(props) {
  const INHABITANT_DIMS = props.size;

  const calculateTextWidth = (text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = getComputedStyle(document.body).font;
    return context.measureText(text).width;
  };

  const BUBBLE_WIDTH = 30 + calculateTextWidth(props.userName);
  const BUBBLE_HEIGHT = 30;

  const [isFocused, setFocusing] = useState(false);
  const [spokenTo, setSpokenTo] = useState(false);

  /**
   * Api call to add position to database.
   * @param {float} x
   * @param {float} y
   */
  const sayHello = (id) => {
    Axios.post("http://localhost:3001/api/hello", { id: id }).then(
      (response) => {
        console.log("yo");
      }
    );
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
            <span id="username">{props.userName}</span>
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
      {/* Say hello option */}
      {spokenTo && (
        <HandshakeRoundedIcon
          style={{
            position: "absolute",
            left: INHABITANT_DIMS,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            sayHello(props.personId);
            setSpokenTo(false);
          }}
        />
      )}
    </div>
  );
}

export default Inhabitant;
