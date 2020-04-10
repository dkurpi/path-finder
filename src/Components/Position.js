import React from "react";

export default function Position(props) {
  const { x, y, properties: obj, targetPosition, isPressed } = props;

  const clName = `pole ${obj.isWall ? "wall" : null}`;
  return (
    <div
      onMouseOver={() => (isPressed ? targetPosition(y, x) : null)}
      onClick={() => {
        targetPosition(y, x);
      }}
      className={clName}
    >
      {x},{y}
    </div>
  );
}
