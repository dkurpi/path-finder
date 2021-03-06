import React, { Component } from "react";
import Actions from "Components/Actions.js";
import Button from "Components/Button.js";
import Position from "Components/Position.js";

import { dijkstra, getPathFromFinishNode } from "utils/algoritms";
import getClassName from "utils/getClassName";
import initGrid from "utils/initGrid";
import PATTERN_01 from "utils/PATTERN_01.js";
import generateMaze from "utils/generateMaze.js";
import sortGridByDistanceToCenter from "utils/sortGridByDistanceToCenter.js";
import { lastPressedEnum } from "utils/enum.js";
import StartPopup from "Components/StartPopup";

import BlurOnIcon from "@material-ui/icons/BlurOn";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { CgPathOutline } from "react-icons/cg";

export default class Grid extends Component {
  state = {
    array: [],
    rows: 77,
    columns: 31,
    startPosition: { x: 15, y: 16 },
    endPosition: { x: 61, y: 16 },
    lastPressed: lastPressedEnum.startPosition,

    isLoaded: false,
    isAnimationStarted: false,
    isAnimationProgress: false,
    wasAnimated: false,
    isPointPressed: false,
    speed: 1.5,
  };
  grid = [];
  refs = [];
  isPressed = false;
  pattern = [];

  componentDidMount() {
    this.createGrid();
  }

  createGrid = () => {
    const { columns, rows, startPosition, endPosition } = this.state;
    this.grid = initGrid(columns, rows, startPosition, endPosition);

    this.setState({
      array: this.grid,
      isLoaded: true,
    });

    this.refs = this.grid.map((row, indexRow) =>
      row.map(() => React.createRef())
    );
  };

  startAnimation = () => {
    const {
      array,
      startPosition,
      endPosition,
      isAnimationStarted,
    } = this.state;
    this.clearAnimated();
    if (isAnimationStarted) {
      const visitedNodes = dijkstra(array, startPosition, endPosition);
      const finishNode = visitedNodes[visitedNodes.length - 1];
      const pathNodes = getPathFromFinishNode(finishNode);
      this.visitingAnimation(visitedNodes, pathNodes);
    }
  };

  visitingAnimation(nodes, pathNodes) {
    const grid = [...this.state.array.slice()];
    const { speed } = this.state;
    const visitedAnimation = (i) => {
      const { y, x } = nodes[i];
      const node = grid[y][x];
      this.refs[y][x].className = getClassName(node);

      const isLastNode = i === nodes.length - 1;
      if (isLastNode) {
        pathNodes[0].isTarget
          ? this.visitingPathAnimation(pathNodes)
          : this.setState({
              isAnimationProgress: false,
              wasAnimated: true,
            });
      }
    };

    for (let i = 0; i < nodes.length; i++) {
      if (this.state.wasAnimated) visitedAnimation(i);
      else
        setTimeout(() => {
          visitedAnimation(i);
        }, 1000 + speed * 7 * i);
    }
  }

  visitingPathAnimation = (pathNodes) => {
    const grid = [...this.state.array.slice()];
    const { speed } = this.state;
    const pathAnimation = (i) => {
      const { y, x } = pathNodes[i];
      const pathNode = grid[y][x];

      pathNode.isPath = true;
      this.refs[y][x].className = getClassName(pathNode);

      const isLastPathNode = pathNodes.length - 1 === i;
      if (isLastPathNode) {
        this.setState({
          isAnimationProgress: false,
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
        }, 1000 + speed * 30 * i);
    }
    this.setState({
      wasAnimated: true,
    });
  };

  handleCellClick = (y, x, click = false) => {
    if (this.state.isAnimationProgress) return;
    if (!this.isPressed && !click) return;

    const { grid, refs } = this;
    const node = grid[y][x];

    if (!node.isTarget && !node.isStart && !this.state.isPointPressed) {
      node.isWall = !node.isWall;
      refs[y][x].className = getClassName(node);

      this.state.isAnimationStarted && this.startAnimation();
      this.saveUserPattern(x, y);
    } else {
      const lastPressed = node.isTarget
        ? lastPressedEnum.endPosition
        : node.isStart
        ? lastPressedEnum.startPosition
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
          this.startAnimation();
        }
      );
    }
  };

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

  clearAnimated = () => {
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

  setWalls = (cordinates, isWallCordinates = true) => {
    const { speed } = this.state;
    this.setState({ isAnimationProgress: true, isAnimationStarted: false });
    this.createGrid();
    const array = this.grid;
    !isWallCordinates && this.modifyGrid("isWall", true, array);

    for (let i = 0; i < cordinates.length; i++) {
      const { x, y } = cordinates[i];
      setTimeout(() => {
        array[x][y].isWall = isWallCordinates;
        const obj = array[x][y];
        this.refs[x][y].className = getClassName(obj);
        if (cordinates.length - 1 === i) {
          this.setState({ isAnimationProgress: false, array });
        }
      }, 1000 + speed * 7 * i);
    }
  };

  saveUserPattern = (y, x) => {
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

  handleRunButton = () => {
    if (this.state.isAnimationProgress) return;
    this.setState(
      {
        isAnimationStarted: true,
        isAnimationProgress: true,
        wasAnimated: false,
      },
      () => {
        this.clearAnimated();
        this.startAnimation();
      }
    );
  };

  handleResetAnimation = (isProgres, callback = () => {}) => {
    if (isProgres) return;
    this.setState({
      isAnimationStarted: false,
      wasAnimated: false,
    });
    this.clearAnimated();
    callback();
  };

  handleSpeed = (speed) => {
    this.setState({ speed });
  };

  render() {
    const {
      isLoaded,
      array,
      wasAnimated,
      columns,
      rows,
      isAnimationProgress,
    } = this.state;

    if (!isLoaded) return <h5>Loading..</h5>;

    return (
      <>
        <div className="menu">
          <section className="menu__section">
            <CgPathOutline className="menu__mainIcon" />
            <h1 className="menu__title">MazeGenerator</h1>
            <div className={"menu__select"}>
              <Button
                className="menu__button"
                text={"Generate random maze"}
                disable={isAnimationProgress}
                clickFcn={() => {
                  this.clearAnimated();
                  const mazeWalls = generateMaze(columns, rows);
                  this.setWalls(
                    sortGridByDistanceToCenter(mazeWalls, columns, rows),
                    true
                  );
                }}
              />
              <Button
                className="menu__button"
                text={"Generate random walls"}
                disable={isAnimationProgress}
                clickFcn={() => {
                  this.clearAnimated();
                  const mazeWalls = generateMaze(columns, rows);
                  this.setWalls(mazeWalls, true);
                }}
              />
            </div>
          </section>

          <section className="menu__section">
            <AccountTreeIcon classes={{ root: "menu__mainIcon" }} />

            <h1 className="menu__title">PathFinder</h1>
            <Actions
              handleRunButton={this.handleRunButton}
              clear={() => {
                this.handleResetAnimation(isAnimationProgress, this.createGrid);
              }}
              clearAll={() => {
                this.handleResetAnimation(isAnimationProgress);
              }}
              isStarted={this.state.isAnimationStarted}
              isProgress={this.state.isAnimationProgress}
              handleSpeed={this.handleSpeed}
            />
          </section>
          <section className="menu__section">
            <BlurOnIcon classes={{ root: "menu__mainIcon" }} />
            <h1 className="menu__title">Patterns</h1>

            <div className={"menu__select"}>
              <Button
                className="menu__button"
                text={"Pattern"}
                disable={isAnimationProgress}
                clickFcn={() => {
                  this.clearAnimated();
                  this.setWalls(PATTERN_01);
                }}
              />
              <Button
                className="menu__button"
                text={` Your Pattern (${this.pattern.length})`}
                disable={isAnimationProgress || this.pattern.length === 0}
                clickFcn={() => {
                  this.clearAnimated();
                  this.setWalls(this.pattern);
                }}
              />
              <Button
                className="menu__button menu__button--danger"
                text={`delete your pattern`}
                disable={isAnimationProgress || this.pattern.length === 0}
                clickFcn={() => {
                  this.pattern = [];
                }}
              />
            </div>
          </section>
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
          className="grid-wrapper"
        >
          {array.map((row, indexRow) =>
            row.map((properties, indexColumn) => (
              <Position
                handleCellClick={this.handleCellClick}
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
          )}
        </div>
        {!this.pattern.length && <StartPopup />}
      </>
    );
  }
}
