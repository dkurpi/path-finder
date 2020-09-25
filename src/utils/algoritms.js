export function dijkstra(array1, start, end) {
  const arrayBufor = array1.slice();
  const flatArray = arrayBufor.flat();
  arrayBufor[start.y][start.x].distance = 0;

  const visitedArray = [];
  const unVisitedArray = flatArray;

  sortArrayByDistance(unVisitedArray);
  let currentPos = unVisitedArray.shift();
  let neighbours = getNeighbours(currentPos, arrayBufor);
  arrayBufor[currentPos.y][currentPos.x].isVisited = true;

  while (unVisitedArray.length) {
    sortArrayByDistance(unVisitedArray);
    currentPos = unVisitedArray.shift();

    if (currentPos.distance === Infinity) {
      return visitedArray;
    }
    visitedArray.push(currentPos);
    arrayBufor[currentPos.y][currentPos.x].isVisited = true;
    if (
      arrayBufor[currentPos.y][currentPos.x].isWall === true &&
      !arrayBufor[currentPos.y][currentPos.x].isTarget
    )
      continue;

    if (currentPos.isTarget) {
      return visitedArray;
    }
    neighbours = getNeighbours(currentPos, arrayBufor);
  }
}

export const sortArrayByDistance = (grid) => {
  grid.sort((a, b) => a.distance - b.distance);
};

export const getNeighbours = (cell, grid) => {
  const neighbours = [];
  const { y, x } = cell;

  if (y < grid.length - 1) {
    neighbours.push(grid[y + 1][x]);
  }
  if (x > 0) {
    neighbours.push(grid[y][x - 1]);
  }
  if (y > 0) {
    neighbours.push(grid[y - 1][x]);
  }
  if (x < grid[y].length - 1) {
    neighbours.push(grid[y][x + 1]);
  }

  const neighboursFiltered = neighbours.filter(
    (neighbour) => !neighbour.isVisited
  );

  for (const item of neighboursFiltered) {
    grid[item.y][item.x].distance = cell.distance + 1;
    grid[item.y][item.x].prevNode = cell;
  }

  return neighboursFiltered;
};

export function getPathFromFinishNode(finishNode) {
  const path = [];
  let node = finishNode;
  while (node.prevNode !== undefined) {
    path.push(node);
    node = node.prevNode;
  }
  return path;
}
