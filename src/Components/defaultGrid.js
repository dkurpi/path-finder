export default function defaultGrid(columns, rows, startPosition, endPosition){
    const array = Array(columns);
    for (let x = 0; x < columns; x++) {
      array[x] = Array(rows);
      for (let y = 0; y < rows; y++) {
        const pole = {
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
        array[x][y] = pole;
      }
    }

    array[endPosition.y][endPosition.x].isTarget = true;
    array[startPosition.y][startPosition.x].isStart = true;
    array[startPosition.y][startPosition.x].distance = 0;

    return array;
}