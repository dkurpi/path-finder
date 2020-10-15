import React, { useState } from "react";
import cx from "classnames";

import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import LoopRoundedIcon from "@material-ui/icons/LoopRounded";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PauseRoundedIcon from "@material-ui/icons/PauseRounded";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { IconButton } from "@material-ui/core";

export default function Actions({
  handleRunButton,
  clearAll,
  clear,
  isStarted,
  isProgress,
  handleSpeed,
}) {
  const [speed, setSpeed] = useState("");

  return (
    <div className="menu__actions">
      <IconButton
        onClick={handleRunButton}
        aria-label="upload picture"
        component="span"
      >
        {isStarted ? (
          <LoopRoundedIcon
            classes={{
              root: cx("button__icon--white", {
                [`button__icon--disabled`]: isProgress,
              }),
            }}
          />
        ) : (
          <PlayArrowRoundedIcon
            classes={{
              root: "button__icon",
            }}
          />
        )}
      </IconButton>
      <IconButton onClick={clearAll} component="span" disabled={isProgress}>
        <PauseRoundedIcon
          classes={{
            root: cx("button__icon--white", {
              [`button__icon--disabled`]: isProgress,
            }),
          }}
        />
      </IconButton>
      <IconButton onClick={clear} component="span" disabled={isProgress}>
        <DeleteForeverIcon
          classes={{
            root: cx("button__icon--white button__icon--delete", {
              [`button__icon--disabled`]: isProgress,
            }),
          }}
          disabled={isProgress}
        />
      </IconButton>
      <IconButton component="span">
        <FormControl
          style={{ width: "80px", heigth: "100% !important", color: "#ccc" }}
        >
          <InputLabel
            style={{ color: "#ddd", fontSize: "12px" }}
            id="demo-simple-select-error-label"
          >
            Speed
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={speed}
            onChange={(e) => {
              console.log(e.target.value);
              handleSpeed(e.target.value);
              setSpeed(e.target.value);
            }}
            place
            label="speed"
            style={{ width: "80px", heigth: "100% !important", color: "#ccc" }}
          >
            <MenuItem value={0.7}>Super Fast</MenuItem>
            <MenuItem value={1.5}>Fast</MenuItem>
            <MenuItem value={4}>Middle</MenuItem>
            <MenuItem value={8}>Slow</MenuItem>
          </Select>
        </FormControl>
      </IconButton>
    </div>
  );
}
