import React, { useRef } from "react";
import cx from "classnames";

const Position = React.forwardRef((props, ref) => {
  const {
    x,
    y,
    properties: obj,
    targetPosition,
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
      onMouseOverCapture={() => (
        // isPressed ? 
        targetPosition(y, x)
        //  : null
         )}
      onMouseDown={() => {
        targetPosition(y, x,true);
      }}
      className={clName}
    >
      {/* {obj.isVisited && !obj.isWall ? obj.distance : null} */}
    </div>
  );
});
export default Position;
