const MazeGenerator = (rows, colums) => {
  const initialMaze = defaultMaze(rows, colums, createCell);
  const maze = [];
  const front = [];

  ///// init
  let current = initialMaze[1][1];
  current.state = state.passage;
  front.push(...unVisitedNeightbours(current, initialMaze));
  maze.push(current);

  //// 4xfront

  while (front.length) {
    ////random front
    const rndBlocked = rnd(front);
    if (rndBlocked.isVisited) continue;
    const neightboursPassages = neightboursPassage(rndBlocked, initialMaze);
    const rndPassage = rnd2(neightboursPassages);
    ////random directin
    const direction = dir(rndPassage, rndBlocked);
    const neightbour = stateChange(initialMaze, rndPassage, direction);

    maze.push(neightbour, rndBlocked);
    rndBlocked.isVisited = true;
    const fronted = unVisitedNeightbours(rndBlocked, initialMaze);
    front.push(...fronted);
  }

  return invertMaze(maze, rows, colums);
};
const createCell = (y, x) => ({
  state: state.blocked,
  x: x,
  y: y,
  isVisited: false,
});
const defaultMaze = (rows, colums) => {
  const defaultMaze = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < colums; j++) {
      row.push(createCell(j, i));
    }
    defaultMaze.push(row);
  }

  return defaultMaze;
};

const unVisitedNeightbours = (cell, grid) => {
  const neightbours = [];
  const { x, y } = cell;
  if (x >= 2) neightbours.push(grid[x - 2][y]);
  if (x < grid.length - 2) neightbours.push(grid[x + 2][y]);
  if (y >= 2) neightbours.push(grid[x][y - 2]);
  if (y < grid[0].length - 2) neightbours.push(grid[x][y + 2]);
  const notVisitedNeightbours = neightbours.filter((neightbour) => {
    if (neightbour.state === state.blocked) return 1;
  });

  //   const index = Math.floor(Math.random() * notVisitedNeightbours.length);
  //   const neightbour = notVisitedNeightbours[index];
  return notVisitedNeightbours;
};

const neightboursPassage = (cell, grid) => {
  const neightbours = [];
  const { x, y } = cell;
  if (x >= 2) neightbours.push(grid[x - 2][y]);
  if (x < grid.length - 2) neightbours.push(grid[x + 2][y]);
  if (y >= 2) neightbours.push(grid[x][y - 2]);
  if (y < grid[0].length - 2) neightbours.push(grid[x][y + 2]);

  const notVisitedNeightbours = neightbours.filter((neightbour) => {
    if (neightbour.state === state.passage) return 1;
  });
  //   const index = Math.floor(Math.random() * notVisitedNeightbours.length);
  //   const neightbour = notVisitedNeightbours[index];

  return notVisitedNeightbours;
};

const rnd = (notVisitedNeightbours) => {
  const index = Math.floor(Math.random() * notVisitedNeightbours.length);
  const neightbour = notVisitedNeightbours.splice(index, 1)[0];
  return neightbour;
};

const rnd2 = (notVisitedNeightbours) => {
  const index = Math.floor(Math.random() * notVisitedNeightbours.length);
  const neightbour = notVisitedNeightbours[index];
  return neightbour;
};

const state = { blocked: "blocked", passage: "passage" };

const dir = (a, b) => {
  if (a.x - b.x > 0) return 0; //left
  if (a.y - b.y > 0) return 1; //up
  if (a.x - b.x < 0) return 2; //right
  if (a.y - b.y < 0) return 3; // bottom
};

const stateChange = (initialMaze, current, direction) => {
  if (direction === 0) {
    initialMaze[current.x - 1][current.y].state = state.passage;
    initialMaze[current.x - 2][current.y].state = state.passage;
    return initialMaze[current.x - 1][current.y];
  }
  if (direction === 1) {
    initialMaze[current.x][current.y - 1].state = state.passage;
    initialMaze[current.x][current.y - 2].state = state.passage;
    return initialMaze[current.x][current.y - 1];
  }
  if (direction === 2) {
    initialMaze[current.x + 1][current.y].state = state.passage;
    initialMaze[current.x + 2][current.y].state = state.passage;
    return initialMaze[current.x + 1][current.y];
  }
  if (direction === 3) {
    initialMaze[current.x][current.y + 1].state = state.passage;
    initialMaze[current.x][current.y + 2].state = state.passage;
    return initialMaze[current.x][current.y + 1];
  }
};

const invertMaze = (maze, rows, columns) => {
  const array = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push({ x: i, y: j, isWall: true });
    }
    array.push(row);
  }

  maze.forEach((item) => (array[item.x][item.y].isWall = false));

  const flatarray = array.flat().filter((item) => item.isWall);
  console.log(flatarray)
  console.log(maze)

  return maze;
};
export default MazeGenerator;
