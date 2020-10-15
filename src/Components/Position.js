import React from "react";
import cx from "classnames";

const Position = React.forwardRef((props, ref) => {
  const { x, y, properties: obj, handleCellClick, wasAnimated } = props;

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
      className="pole-wrapper"
      onMouseEnter={() => handleCellClick(y, x)}
      onMouseDown={() => {
        handleCellClick(y, x, true);
      }}
    >
      <div ref={ref} className={clName}></div>
    </div>
  );
});
export default Position;
