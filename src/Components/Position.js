import React, { useRef } from "react";
import cx from "classnames";

export default function Position(props) {
  const { x, y, properties: obj, targetPosition, isPressed } = props;

  const node = useRef();

  const clName = cx({
    pole: true,
    wall: obj.isWall ,
    target: obj.isTarget,
    start: obj.isStart,
    visited:
      obj.isAnimated &&
      !obj.isStart &&
      !obj.isTarget &&
      !obj.isWall &&
      !obj.isPath,
    path: obj.isPath && !obj.isWall ,
  });

  return (
    <div
      ref={node}
      onMouseOver={() => (isPressed ? targetPosition(y, x) : null)}
      onMouseDown={() => {
        targetPosition(y, x);
      }}
      className={clName}
    >
      {obj.isAnimated && !obj.isWall ? obj.distance : null}
    </div>
  );
}
