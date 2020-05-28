export default function sortGrid(coords, columns, rows) {

  const array = Array(columns);
  for (let x = 0; x < columns; x++) {
    array[x] = Array(rows);
    for (let y = 0; y < rows; y++) {
      const pole = {
        isWall: false,
        y: y,
        x: x,
      };
      array[x][y] = pole;
    }
  }
  const flatArray = array.flat();
  coords.forEach((element) => {
    const index = flatArray.indexOf(array[element.x][element.y]);
    console.log(index);

    flatArray.splice(index, 1);
  });

  flatArray.sort((a, b) => {
    const y = rows / 2 - 1;
    const x = columns / 2 - 1;
    const ay = a.y - y;
    const ax = a.x - x;
    const by = b.y - y;
    const bx = b.x - x;
    return Math.abs(ay * ay + ax * ax) - Math.abs(by * by + bx * bx);
  });
  return flatArray;
}
