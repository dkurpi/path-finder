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

  defaultGrid = () => {
    const columns = 20;
    const rows = 30;

    const array = Array(rows);
    for (let x = 0; x < columns; x++) {
      array[x] = Array(rows);
      for (let y = 0; y < rows; y++) {
        const pole = { isWall: false, y: x, x: y };
        array[x][y] = pole;
      }
    }
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
  runScript = () => {
    console.log("run");
  };

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
