import React from "react";
import cx from "classnames";

export default function Position(props) {
  const { x, y, properties: obj, targetPosition, isPressed } = props;

  const clName = cx({
    pole: true,
    wall: obj.isWall,
    target: obj.isTarget,
    start: obj.isStart,
    visited:
      obj.isAnimated &&
      !obj.isStart &&
      !obj.isTargetc &&
      !obj.isWall &&
      !obj.isPath,
    path: obj.isPath,
  });

  return (
    <div
      onMouseOver={() => (isPressed ? targetPosition(y, x) : null)}
      onMouseDown={() => {
        targetPosition(y, x);
      }}
      className={clName}
    >
      {obj.isAnimated ? obj.distance : null}
    </div>
  );
}
