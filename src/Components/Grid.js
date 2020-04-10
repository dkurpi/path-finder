import React, { Component } from "react";
import Position from "./Position.js";
import Menu from "./Menu.js";

export default class Grid extends Component {
  state = {
    array: [1, 2, 3, 5, 6, 7],
    isLoaded: false,
    isClicked: false,
    isPressed: false,
  };

  runScript = (array) => {
    console.log("run");
  };

  ////////////Obsługa grida
  defaultGrid = () => {
    const columns = 20;
    const rows = 30;

    const array = Array(rows);
    for (let x = 0; x < columns; x++) {
      array[x] = Array(rows);
      for (let y = 0; y < rows; y++) {
        const pole = {
          isWall: false,
          y: x,
          x: y,
          isTarget: false,
          isStart: false,
          distance: Infinity,
        };
        array[x][y] = pole;
      }
    }
    array[10][26].isTarget = true;
    array[6][10].isStart = true;
    array[6][10].distance = 0;
    console.log(array);
    return array;
  };

  startGrid = () => {
    const array = this.defaultGrid();
    this.setState({
      array,
      isLoaded: true,
    });
  };

  targetPosition = (y, x) => {
    const { array } = this.state;

    array[y][x].isWall = true;
    console.log(y, x);
    this.setState({
      array,
    });
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
        <Menu runScript={this.runScript} clear={this.startGrid} />

        <div
          onMouseDown={() => {
            this.setState({ isPressed: true });
          }}
          onMouseUp={() => {
            this.setState({ isPressed: false });
          }}
          className="gridContainer"
        >
          {grid}
        </div>
      </>
    );
  }
}
