import React, { Component } from "react";
import Position from "./Position.js";
import Menu from "./Menu.js";
import pop1 from "../Sounds/pop1.mp3";
import pop2 from "../Sounds/pop2.mp3";
import pop3 from "../Sounds/pop3.mp3";
import pattern from "./pattern.js";
import MazeGenerator from "./MazeGenerator.js";
import cx from "classnames";

export default class Grid extends Component {
  state = {
    array: [1, 2, 3, 5, 6, 7],
    pattern: [],
    rows: 73,
    columns: 31,
    isLoaded: false,
    isClicked: false,
    isPressed: false,
    isPointPressed: false,
    lastPressed: "startPosition",
    wasAnimated: false,
    isStarted: false,
    startPosition: { x: 1, y: 1 },
    endPosition: { x: 29, y: 19 },
    isProgress: false,
  };

  grid = [];

  runScript = () => {
    const { array, startPosition, endPosition, isStarted } = this.state;
    this.clearPath();
    if (isStarted) {
      console.log("runScript");
      const visitedNodes = this.dijkstra(array, startPosition, endPosition);
      const finishNode = visitedNodes[visitedNodes.length - 1];
      const pathNodes = this.backToStartArray(finishNode);
      this.animate(visitedNodes, pathNodes);
    }
  };

  audio1 = new Audio(pop1);
  audio2 = new Audio(pop2);
  audio3 = new Audio(pop3);

  /////////////algo
  backToStartArray = (finishNode) => {
    const path = [];
    let node = finishNode;
    while (node.prevNode !== undefined) {
      path.push(node);
      node = node.prevNode;
    }
    return path;
  };

  dijkstra(array1, start, end) {
    const arrayBufor = array1.slice();
    const flatArray = arrayBufor.flat();
    arrayBufor[start.y][start.x].distance = 0;

    const VisitedArray = [];
    const unVisitedArray = flatArray;

    this.sortArrayByDistance(unVisitedArray);
    let currentPos = unVisitedArray.shift();
    let neighbours = this.neighbours(currentPos, arrayBufor);
    arrayBufor[currentPos.y][currentPos.x].isVisited = true;

    while (unVisitedArray.length) {
      this.sortArrayByDistance(unVisitedArray);
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
        this.setState({ array: arrayBufor });
        return VisitedArray;
      }
      neighbours = this.neighbours(currentPos, arrayBufor);
    }
  }

  sortArrayByDistance = (array) => {
    array.sort((a, b) => a.distance - b.distance);
  };

  neighbours = (obj, array) => {
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

  ////////////Obsługa grida

  getClassName = (obj) => {
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
  };

  animate(nodes, pathNodes) {
    const grid = [...this.state.array.slice()];
    const visitedAnimation = (i) => {
      const obj = grid[nodes[i].y][nodes[i].x];
      this.refs[nodes[i].y][nodes[i].x].className = this.getClassName(obj);
      // this.setState({
      //   grid,
      // });
      if (i === nodes.length - 1) {
        pathNodes[0].isTarget
          ? this.animatePath(pathNodes, "isPath")
          : this.setState({
              isProgress: false,
              wasAnimated: true,
            });
      }
    };

    for (let i = 0; i < nodes.length; i++) {
      if (this.state.wasAnimated) visitedAnimation(i);
      else
        setTimeout(() => {
          visitedAnimation(i);
        }, 5 * i);
    }
  }

  animatePath = (nodes) => {
    const pathAnimation = (i) => {
      const grid = [...this.state.array.slice()];
      const obj = grid[nodes[i].y][nodes[i].x];
      obj.isPath = true;
      this.refs[nodes[i].y][nodes[i].x].className = this.getClassName(obj);
    };

    for (let i = 0; i < nodes.length; i++) {
      if (this.state.wasAnimated) {
        pathAnimation(i);
        if (nodes.length - 1 === i) {
          // this.audio3.play();
          this.setState({
            isProgress: false,
            wasAnimated: true,
          });
        }
      } else
        setTimeout(() => {
          pathAnimation(i);
          if (nodes.length - 1 === i) {
            // this.audio3.play();
            this.setState({
              isProgress: false,
            });
            console.log("elo");
          }
          // else this.audio2.play();
        }, 25 * i);
    }
    this.setState({
      wasAnimated: true,
    });
  };
  //////////////reset default
  defaultGrid = () => {
    const { columns, rows } = this.state;

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

    return array;
  };

  startGrid = () => {
    const array = this.defaultGrid();
    const { startPosition, endPosition } = this.state;
    array[endPosition.y][endPosition.x].isTarget = true;
    array[startPosition.y][startPosition.x].isStart = true;
    array[startPosition.y][startPosition.x].distance = 0;
    this.grid = array;
    console.log(this.grid);
    this.setState({
      array,
      isLoaded: true,
    });
    this.refs = array.map((row, indexRow) =>
      row.map((properties, indexColumn) => React.createRef())
    );
  };

  targetPosition = (y, x, click = false) => {
    console.log(click);
    if (this.state.isProgress) return;
    if (!this.isPressed && !click) return;
    const array = this.grid;
    if (
      !array[y][x].isTarget &&
      !array[y][x].isStart &&
      !this.state.isPointPressed
    ) {
      console.log(y, x, this.isPressed, array[y][x].isWall);

      const obj = array[y][x];
      array[y][x].isWall = !array[y][x].isWall;
      this.refs[y][x].className = this.getClassName(obj);
      this.state.isStarted && this.runScript();

      this.wallPattern(x, y);
    } else {
      const lastPressed = array[y][x].isTarget
        ? "endPosition"
        : array[y][x].isStart
        ? "startPosition"
        : this.state.lastPressed;
      this.setState(
        {
          [lastPressed]: { x: x, y: y },
          isPointPressed: true,
          lastPressed,
        },
        () => {
          this.modifyGrid("isTarget", false);
          this.modifyGrid("isStart", false);
          this.runScript();
        }
      );
    }
  };

  ////zmiania wartosci grid
  modifyGrid = (properties, set) => {
    const { array, columns, rows, startPosition, endPosition } = this.state;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        array[x][y][properties] = set;
      }
    }

    array[startPosition.y][startPosition.x].isStart = true;
    array[endPosition.y][endPosition.x].isTarget = true;

    this.setState({
      array,
    });
  };

  clearPath = () => {
    for (let x = 0; x < this.state.columns; x++) {
      for (let y = 0; y < this.state.rows; y++) {
        this.refs[x][y].className = this.getClassName(this.state.array[x][y]);
      }
    }
    this.modifyGrid("isVisited", false);
    this.modifyGrid("isPath", false);
    this.modifyGrid("distance", Infinity);
    this.modifyGrid("prevNode", {});
  };

  componentDidMount() {
    this.startGrid();
  }

  gridPattern = (cordinates, isWallCordinates = true) => {
    this.setState({ isProgress: true });
    this.startGrid();
    const array = this.grid;
    console.log(cordinates);
    !isWallCordinates && this.modifyGrid("isWall", true);

    for (let i = 0; i < cordinates.length; i++) {
      setTimeout(() => {
        const obj = array[cordinates[i].x][cordinates[i].y];
        array[cordinates[i].x][cordinates[i].y].isWall = isWallCordinates;
        this.refs[cordinates[i].x][
          cordinates[i].y
        ].className = this.getClassName(obj);

        if (cordinates.length - 1 === i) {
          this.setState({ isProgress: false, array });
        }
      }, 1000 + 10 * i);
    }
  };

  pattern = [];
  wallPattern = (y, x) => {
    const isWall = this.pattern.some((obj) => obj.x === x && obj.y === y);
    console.log(this.pattern, isWall);
    if (!isWall) {
      this.pattern.push({ y: y, x: x });
    } else {
      this.pattern.splice(
        this.pattern.findIndex((id) => id.y === y && id.x === x),
        1
      );
    }
  };

  refs = [];
  isPressed = false;
  render() {
    const { isLoaded, array, wasAnimated } = this.state;
    if (!isLoaded) return <h5>Loading..</h5>;
    console.log("render");
    const grid = array.map((row, indexRow) =>
      row.map((properties, indexColumn) => (
        <Position
          targetPosition={this.targetPosition}
          x={indexColumn}
          y={indexRow}
          wasAnimated={wasAnimated}
          ref={(rf) => {
            this.refs[indexRow][indexColumn] = rf;
            return true;
          }}
          properties={properties}
          isPressed={this.isPressed}
        />
      ))
    );

    return (
      <>
        <div style={{ display: "flex" }}>
          <button
            onClick={() => {
              if (!this.state.isProgress) {
                const coords = MazeGenerator(
                  this.state.columns,
                  this.state.rows
                );
                this.clearPath();
                this.gridPattern(coords, false);
              }
            }}
          >
            Render Maze Korytarz
          </button>

          <button
            onClick={() => {
              if (!this.state.isProgress) {
                const coords = MazeGenerator(
                  this.state.columns,
                  this.state.rows
                );
                this.clearPath();
                this.gridPattern(coords, true);
              }
            }}
          >
            Render Maze Walls
          </button>

          <button
            onClick={() => {
              if (!this.state.isProgress && this.pattern !== []) {
                this.clearPath();
                console.log(this.pattern);
                this.gridPattern(this.pattern);
              }
            }}
          >
            Render Your Pattern
          </button>
          <button
            onClick={() => {
              if (!this.state.isProgress) {
                this.clearPath();
                this.gridPattern(pattern);
              }
            }}
          >
            Render Pattern
          </button>
        </div>
        <Menu
          runScript={() => {
            if (!this.state.isProgress) {
              this.setState(
                {
                  isStarted: true,
                  isProgress: true,
                  wasAnimated: false,
                },
                () => {
                  this.clearPath();
                  this.runScript();
                }
              );
            }
          }}
          clear={() => {
            if (!this.state.isProgress) {
              this.setState({
                isStarted: false,
                wasAnimated: false,
              });
              this.clearPath();
              this.startGrid();
            }
          }}
          clearPath={() => {
            if (!this.state.isProgress) {
              this.setState({
                isStarted: false,
                wasAnimated: false,
              });
              this.clearPath();
            }
          }}
        />

        <div
          onMouseDown={() => {
            this.isPressed = true;
          }}
          onMouseUp={() => {
            this.isPressed = false;

            this.setState({ isPointPressed: false });
          }}
          onMouseLeave={() => {
            this.isPressed = false;

            this.setState({ isPointPressed: false });
          }}
          className="gridContainer"
        >
          {grid}
        </div>
      </>
    );
  }
}
