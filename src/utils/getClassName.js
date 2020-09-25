import cx from "classnames";

export default function getClassName(obj) {
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
      !obj.isPath,
    path: obj.isPath && !obj.isWall,
  });
  return clName;
}
