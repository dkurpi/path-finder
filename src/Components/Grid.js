import React, { Component } from "react";
import Position from "./Position.js";
import Menu from "./Menu.js";
import pop1 from "../Sounds/pop1.mp3";
import pop2 from "../Sounds/pop2.mp3";
import pop3 from "../Sounds/pop3.mp3";

export default class Grid extends Component {
  state = {
    array: [1, 2, 3, 5, 6, 7],
    rows: 30,
    columns: 20,
    isLoaded: false,
    isClicked: false,
    isPressed: false,
    isPointPressed: false,
    lastPressed: "startPosition",
    wasAnimated: false,
    isStarted: false,
    startPosition: { x: 5, y: 8 },
    endPosition: { x: 20, y: 12 },
    isProgress: false,
  };

  runScript = () => {
    const { array, startPosition, endPosition, isStarted } = this.state;
    this.clearPath();
    if (isStarted) {
      const visitedNodes = this.dijkstra(array, startPosition, endPosition);
      const finishNode = visitedNodes[visitedNodes.length - 1];
      const pathNodes = this.backToStartArray(finishNode);
      this.animate(visitedNodes, "isAnimated", pathNodes);
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

  animate(nodes, type, pathNodes) {
    const visitedAnimation = (i) => {
      const grid = [...this.state.array.slice()];
      grid[nodes[i].y][nodes[i].x][type] = true;

      this.setState({
        grid,
        // wasAnimated: true,
      });

      if (i === nodes.length - 1) {
        pathNodes[0].isTarget
          ? this.animatePath(pathNodes, "isPath")
          : this.setState({
              grid,
              isProgress: false,
            });
      }
    };

    for (let i = 0; i < nodes.length; i++) {
      if (this.state.wasAnimated) visitedAnimation(i);
      else
        setTimeout(() => {
          visitedAnimation(i);
        }, 30 * i);
    }
  }

  animatePath = (nodes, type) => {
    const pathAnimation = (i) => {
      const grid = [...this.state.array.slice()];
      grid[nodes[i].y][nodes[i].x][type] = true;

      this.setState({
        grid,
      });
    };

    console.log(this.state.wasAnimated);
    for (let i = 0; i < nodes.length; i++) {
      if (this.state.wasAnimated) {
        pathAnimation(i);
        this.setState({
          isProgress: false,
        });
      } else
        setTimeout(() => {
          pathAnimation(i);
          if (nodes.length - 1 === i) {
            this.audio3.play();
            this.setState({
              isProgress: false,
            });
            console.log("elo");
          } else this.audio2.play();
        }, 100 * i);
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

    this.setState({
      array,
      isLoaded: true,
    });
  };

  targetPosition = (y, x) => {
    if (this.state.isProgress) return;
    const array = this.state.array.slice();
    if (
      !array[y][x].isTarget &&
      !array[y][x].isStart &&
      !this.state.isPointPressed
    ) {
      array[y][x].isWall = !array[y][x].isWall;
      this.runScript();
      this.audio1.play();
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

    this.setState({
      array,
    });
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
    this.modifyGrid("isVisited", false);
    this.modifyGrid("isAnimated", false);
    this.modifyGrid("isPath", false);
    this.modifyGrid("distance", Infinity);
    this.modifyGrid("prevNode", {});
  };

  componentDidMount() {
    this.startGrid();
  }

  render() {
    const { isLoaded, array, isPressed } = this.state;
    if (!isLoaded) return <h5>Loading..</h5>;
    const grid = array.map((row, indexRow) =>
      row.map((properties, indexColumn) => (
        <Position
          targetPosition={this.targetPosition}
          x={indexColumn}
          y={indexRow}
          properties={properties}
          isPressed={isPressed}
        />
      ))
    );

    return (
      <>
        <Menu
          runScript={() => {
            if (!this.state.isProgress) {
              this.setState(
                {
                  isStarted: true,
                  isProgress: true,
                },
                () => {
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
            this.setState({ isPressed: true });
          }}
          onMouseUp={() => {
            this.setState({ isPressed: false, isPointPressed: false });
          }}
          onMouseLeave={() => {
            this.setState({ isPressed: false, isPointPressed: false });
          }}
          className="gridContainer"
        >
          {grid}
        </div>
      </>
    );
  }
}
