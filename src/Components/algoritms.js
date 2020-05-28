export function backToStartArray(finishNode) {
  const path = [];
  let node = finishNode;
  while (node.prevNode !== undefined) {
    path.push(node);
    node = node.prevNode;
  }
  return path;
}

export function dijkstra(array1, start, end) {
  const arrayBufor = array1.slice();
  const flatArray = arrayBufor.flat();
  arrayBufor[start.y][start.x].distance = 0;

  const VisitedArray = [];
  const unVisitedArray = flatArray;

  sortArrayByDistance(unVisitedArray);
  let currentPos = unVisitedArray.shift();
  let neighbours = getNeighbours(currentPos, arrayBufor);
  arrayBufor[currentPos.y][currentPos.x].isVisited = true;

  while (unVisitedArray.length) {
    sortArrayByDistance(unVisitedArray);
    currentPos = unVisitedArray.shift();
    if (currentPos.distance === Infinity) {
      return VisitedArray;
    }
    VisitedArray.push(currentPos);
    arrayBufor[currentPos.y][currentPos.x].isVisited = true;
    if (
      arrayBufor[currentPos.y][currentPos.x].isWall === true &&
      !arrayBufor[currentPos.y][currentPos.x].isTarget
    )
      continue;

    if (currentPos.isTarget) {
      return VisitedArray;
    }
    neighbours = getNeighbours(currentPos, arrayBufor);
  }
}

const sortArrayByDistance = (array) => {
  array.sort((a, b) => a.distance - b.distance);
};

const getNeighbours = (obj, array) => {
  const neighbours = [];

  if (obj.y < array.length - 1) {
    neighbours.push(array[obj.y + 1][obj.x]);
  }
  if (obj.x > 0) {
    neighbours.push(array[obj.y][obj.x - 1]);
  }
  if (obj.y > 0) {
    neighbours.push(array[obj.y - 1][obj.x]);
  }
  if (obj.x < array[obj.y].length - 1) {
    neighbours.push(array[obj.y][obj.x + 1]);
  }

  const neighboursFiltered = neighbours.filter(
    (neighbour) => !neighbour.isVisited
  );

  for (const item of neighboursFiltered) {
    array[item.y][item.x].distance = obj.distance + 1;
    array[item.y][item.x].prevNode = obj;
  }

  return neighboursFiltered;
};
