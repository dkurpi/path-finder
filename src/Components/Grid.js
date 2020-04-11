import React, { Component } from "react";
import Position from "./Position.js";
import Menu from "./Menu.js";

export default class Grid extends Component {
  state = {
    array: [1, 2, 3, 5, 6, 7],
    isLoaded: false,
    isClicked: false,
    isPressed: false,
    startPosition: { x: 2, y: 5 },
    endPosition: { x: 25, y: 16 },
  };

  runScript = () => {
    const { array } = this.state;
    const visitedNodes = this.dijkstra(array);
    const finishNode = visitedNodes[visitedNodes.length - 1];
    const pathNodes = this.backToStartArray(finishNode);
    this.animate(visitedNodes, "isAnimated", pathNodes);
  };

  backToStartArray = (finishNode) => {
    const path = [];
    let node = finishNode;
    while (node.prevNode !== undefined) {
      path.push(node);
      node = node.prevNode;
    }
    console.log(path);
    return path;
  };

  dijkstra(array1) {
    const arrayBufor = array1.slice();
    const flatArray = arrayBufor.flat();

    const VisitedArray = [];
    const unVisitedArray = flatArray;

    this.sortArrayByDistance(unVisitedArray);
    let currentPos = unVisitedArray.shift();
    let neighbours = this.neighbours(currentPos, arrayBufor);
    arrayBufor[currentPos.y][currentPos.x].isVisited = true;

    while (unVisitedArray.length) {
      this.sortArrayByDistance(unVisitedArray);
      currentPos = unVisitedArray.shift();
      VisitedArray.push(currentPos);
      arrayBufor[currentPos.y][currentPos.x].isVisited = true;
      if (arrayBufor[currentPos.y][currentPos.x].isWall === true) continue;
      if (arrayBufor[currentPos.y][currentPos.x].distance === Infinity) return  alert("Brak ścieżki");
      if (currentPos.isTarget) {
        this.setState({ array: arrayBufor });
        return VisitedArray;
      }
      neighbours = this.neighbours(currentPos, arrayBufor);
    }
    console.log("juz2");
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
    for (let i = 0; i < nodes.length; i++) {
      setTimeout(() => {
        const grid = [...this.state.array.slice()];
        grid[nodes[i].y][nodes[i].x][type] = true;

        this.setState({
          grid,
        });
        if (i === nodes.length - 1) this.animatePath(pathNodes, "isPath");
      }, 35 * i);
    }
  }

  animatePath(nodes, type) {
    for (let i = 0; i < nodes.length; i++) {
      setTimeout(() => {
        const grid = [...this.state.array.slice()];
        grid[nodes[i].y][nodes[i].x][type] = true;

        this.setState({
          grid,
        });
      }, 35 * i);
    }
  }

  defaultGrid = () => {
    const columns = 20;
    const rows = 30;

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

    console.log(array);
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
    const array = this.state.array.slice();

    array[y][x].isWall = !array[y][x].isWall;
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
          onMouseLeave={() => {
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
