export default function initGrid(columns, rows, startPosition, endPosition) {
  const grid = Array(columns);
  for (let x = 0; x < columns; x++) {
    grid[x] = Array(rows);
    for (let y = 0; y < rows; y++) {
      const cell = {
        isWall: false,
        y: x,
        x: y,
        isTarget: false,
        isAnimated: false,
        isStart: false,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        prevNode: {},
      };
      grid[x][y] = cell;
    }
  }

  grid[endPosition.y][endPosition.x].isTarget = true;
  grid[startPosition.y][startPosition.x].isStart = true;
  grid[startPosition.y][startPosition.x].distance = 0;

  return grid;
}
