import React from "react";
import cx from "classnames";

import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import LoopRoundedIcon from "@material-ui/icons/LoopRounded";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PauseRoundedIcon from "@material-ui/icons/PauseRounded";



import { IconButton } from "@material-ui/core";

export default function Actions({
  handleRunButton,
  clearAll,
  clear,
  isStarted,
  isProgress,
}) {
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
    </div>
  );
}
