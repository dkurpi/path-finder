import React, { Component } from "react";
import Position from "./Position.js";
import Menu from "./Menu.js";
import Button from "./Button.js";

import { dijkstra, backToStartArray } from "./algoritms";
import getClassName from "./getClassName";
import defaultGrid from "./defaultGrid";
import pattern from "./pattern.js";
import generatorMaze from "./generatorMaze.js";
import sortGrid from "./sortGrid.js";

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
    startPosition: { x: 21, y: 14 },
    endPosition: { x: 71, y: 29 },
    isProgress: false,
  };
  grid = [];
  refs = [];
  isPressed = false;
  pattern = [];

  componentDidMount() {
    this.startGrid();
  }

  startGrid = () => {
    const { columns, rows, startPosition, endPosition } = this.state;
    this.grid = defaultGrid(columns, rows, startPosition, endPosition);

    this.setState({
      array: this.grid,
      isLoaded: true,
    });

    this.refs = this.grid.map((row, indexRow) =>
      row.map((properties, indexColumn) => React.createRef())
    );
  };

  runScript = () => {
    const { array, startPosition, endPosition, isStarted } = this.state;
    this.clearVisited();
    if (isStarted) {
      const visitedNodes = dijkstra(array, startPosition, endPosition);
      const finishNode = visitedNodes[visitedNodes.length - 1];
      const pathNodes = backToStartArray(finishNode);
      this.visitingAnimation(visitedNodes, pathNodes);
    }
  };

  visitingAnimation(nodes, pathNodes) {
    const grid = [...this.state.array.slice()];

    const visitedAnimation = (i) => {
      const { y, x } = nodes[i];
      const node = grid[y][x];
      this.refs[y][x].className = getClassName(node);

      const isLastNode = i === nodes.length - 1;
      if (isLastNode) {
        pathNodes[0].isTarget
          ? this.visitingPathAnimation(pathNodes)
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
        }, 1000 + 2 * i);
    }
  }

  visitingPathAnimation = (pathNodes) => {
    const grid = [...this.state.array.slice()];
    const pathAnimation = (i) => {
      const { y, x } = pathNodes[i];
      const pathNode = grid[y][x];

      pathNode.isPath = true;
      this.refs[y][x].className = getClassName(pathNode);

      const isLastPathNode = pathNodes.length - 1 === i;
      if (isLastPathNode) {
        this.setState({
          isProgress: false,
          wasAnimated: true,
        });
      }
    };

    for (let i = 0; i < pathNodes.length; i++) {
      if (this.state.wasAnimated) {
        pathAnimation(i);
      } else
        setTimeout(() => {
          pathAnimation(i);
        }, 15 * i);
    }
    this.setState({
      wasAnimated: true,
    });
  };
  //////////////reset default

  targetPosition = (y, x, click = false) => {
    if (this.state.isProgress) return;
    if (!this.isPressed && !click) return;

    const { grid, refs } = this;
    const node = grid[y][x];

    if (!node.isTarget && !node.isStart && !this.state.isPointPressed) {
      node.isWall = !node.isWall;
      refs[y][x].className = getClassName(node);

      this.state.isStarted && this.runScript();
      this.wallPattern(x, y);
    } else {
      const lastPressed = node.isTarget
        ? "endPosition"
        : node.isStart
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
  modifyGrid = (properties, set, array = this.state.array) => {
    const { columns, rows, startPosition, endPosition } = this.state;
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

  clearVisited = () => {
    for (let x = 0; x < this.state.columns; x++) {
      for (let y = 0; y < this.state.rows; y++) {
        this.refs[x][y].className = getClassName(this.state.array[x][y]);
      }
    }
    this.modifyGrid("isVisited", false);
    this.modifyGrid("isPath", false);
    this.modifyGrid("distance", Infinity);
    this.modifyGrid("prevNode", {});
  };

  gridPattern = (cordinates, isWallCordinates = true) => {
    this.setState({ isProgress: true });
    this.startGrid();
    const array = this.grid;
    !isWallCordinates && this.modifyGrid("isWall", true, array);

    for (let i = 0; i < cordinates.length; i++) {
      const { x, y } = cordinates[i];
      setTimeout(() => {
        array[x][y].isWall = isWallCordinates;
        const obj = array[x][y];
        this.refs[x][y].className = getClassName(obj);
        console.log("0");
        if (cordinates.length - 1 === i) {
          console.log("1");

          this.setState({ isProgress: false, array });
        }
      }, 1000 + 5 * i);
    }
  };

  wallPattern = (y, x) => {
    const isWall = this.pattern.some((obj) => obj.x === x && obj.y === y);
    if (!isWall) {
      this.pattern.push({ y: y, x: x });
    } else {
      this.pattern.splice(
        this.pattern.findIndex((id) => id.y === y && id.x === x),
        1
      );
    }
  };

  /////////

  handleRunButton = () => {
    if (this.state.isProgress) return;
    this.setState(
      {
        isStarted: true,
        isProgress: true,
        wasAnimated: false,
      },
      () => {
        this.clearVisited();
        this.runScript();
      }
    );
  };

  handleResetAnimation = (isProgres, callback = () => {}) => {
    if (isProgres) return;
    this.setState({
      isStarted: false,
      wasAnimated: false,
    });
    this.clearVisited();
    callback();
  };
  render() {
    const {
      isLoaded,
      array,
      wasAnimated,
      columns,
      rows,
      isProgress,
    } = this.state;
    if (!isLoaded) return <h5>Loading..</h5>;

    const grid = array.map((row, indexRow) =>
      row.map((properties, indexColumn) => (
        <Position
          targetPosition={this.targetPosition}
          x={indexColumn}
          y={indexRow}
          wasAnimated={wasAnimated}
          ref={(ref) => {
            this.refs[indexRow][indexColumn] = ref;
          }}
          properties={properties}
          isPressed={this.isPressed}
        />
      ))
    );
    return (
      <>
        <Menu
          handleRunButton={this.handleRunButton}
          clear={() => {
            this.handleResetAnimation(isProgress, this.startGrid);
          }}
          clearAll={() => {
            this.handleResetAnimation(isProgress);
          }}
        />

        <div>
          <Button
            className="button is-light"
            text={"Render Random Maze"}
            disable={isProgress}
            clickFcn={() => {
              this.clearVisited();
              const mazeWalls = generatorMaze(columns, rows);
              this.gridPattern(sortGrid(mazeWalls, columns, rows), true);
            }}
          />

          <Button
            className="button is-light"
            text={"Render Random Walls"}
            disable={isProgress}
            clickFcn={() => {
              this.clearVisited();
              const mazeWalls = generatorMaze(columns, rows);
              this.gridPattern(mazeWalls, true);
            }}
          />

          <Button
            className="button is-light"
            text={` Render Your Pattern (${this.pattern.length})`}
            disable={isProgress || this.pattern.length === 0}
            clickFcn={() => {
              this.clearVisited();
              this.gridPattern(this.pattern);
            }}
          />
          <Button
            className="button is-danger"
            text={`delete your pattern`}
            disable={isProgress || this.pattern.length === 0}
            clickFcn={() => {
              this.pattern = [];
            }}
          />
          {/* <Button
            className="button is-danger small"
            text={`save as your pattern`}
            disable={isProgress}
            clickFcn={() => {
              this.pattern = array.flat();
              console.log(this.pattern);
            }}
          /> */}

          <Button
            className="button is-light"
            text={" Render Patterns"}
            disable={isProgress}
            clickFcn={() => {
              this.clearVisited();
              this.gridPattern(pattern);
            }}
          />
        </div>
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
