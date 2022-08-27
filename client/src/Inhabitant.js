import React, { useState } from "react";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";

import "./App.css";

function Inhabitant(props) {
  const INHABITANT_DIMS = props.size;
  const BUBBLE_DIM = 100;

  const [isFocused, setFocusing] = useState(false);
  const [spokenTo, setSpokenTo] = useState(false);

  return (
    <div>
      {/* Username bubble */}
      {isFocused && (
        <div style={{ opacity: 0.5 }}>
          <div
            className="arrow"
            style={{
              position: "absolute",
              backgroundColor: "grey",
              left: (props.x - BUBBLE_DIM / 4) * props.zoom,
              top: (props.y - 10) * props.zoom, // size of border of arrow maybe make a variable?
              borderRadius: 5,
            }}
          />
          <div
            className="not-selectable"
            style={{
              color: "rgb(0, 0, 0, 255)",
              backgroundColor: "grey",
              position: "absolute",
              textAlign: "center",
              left: (props.x - BUBBLE_DIM / 4) * props.zoom,
              top: (props.y - BUBBLE_DIM / 4) * props.zoom,
              width: BUBBLE_DIM * props.zoom,
              height: (BUBBLE_DIM / 4) * props.zoom,
              borderRadius: 5,
            }}
          >
            yo
          </div>
        </div>
      )}
      {/* Inhabitant */}
      <EmojiPeopleRoundedIcon
        className="selectable"
        style={{
          color: "white",
          position: "absolute",
          left: props.x,
          top: props.y,
          width: INHABITANT_DIMS * props.zoom,
          height: INHABITANT_DIMS * props.zoom,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setSpokenTo(!spokenTo);
        }}
        onMouseEnter={() => setFocusing(true)}
        onMouseLeave={() => setFocusing(false)}
      />
      {/* Say hello option */}
      {spokenTo && <HandshakeRoundedIcon />}
    </div>
  );
}

export default Inhabitant;
