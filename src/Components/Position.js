import React, { useRef } from "react";
import cx from "classnames";

const Position = React.forwardRef((props, ref) => {
  const {
    x,
    y,
    properties: obj,
    targetPosition,
    isPressed,
    wasAnimated,
  } = props;

  const clName = cx({
    pole: true,
    wall: obj.isWall,
    target: obj.isTarget,
    start: obj.isStart,
    visited:
      obj.isVisited &&
      !obj.isStart &&
      !obj.isTarget &&
      !obj.isWall &&
      !obj.isPath &&
      wasAnimated,
    path: obj.isPath && !obj.isWall,
  });

  return (
    <div
      ref={ref}
      onMouseOver={() => (isPressed ? targetPosition(y, x, "hover") : null)}
      onMouseDown={() => {
        targetPosition(y, x);
      }}
      className={clName}
    >
      {/* {obj.isVisited && !obj.isWall ? obj.distance : null} */}
    </div>
  );
});
export default Position;
