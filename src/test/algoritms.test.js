import { sortArrayByDistance, getNeighbours } from "utils/algoritms";

describe("dijakstra algoritm tests", () => {
  describe("sortArrayByDistace", () => {
    const array = new Array(1000).fill(1).map((i) => {
      return { distance: Math.floor(Math.random() * 100) };
    });

    test("all have distance property", () => {
      sortArrayByDistance(array);

      array.forEach((item) => {
        expect(item).toHaveProperty("distance");
      });
    });
    test("are answer correct", () => {
      sortArrayByDistance(array);
      const answer = array.map((i) => i.distance);
      const correct = array.map((i) => i.distance).sort((a, b) => a - b);
      expect(answer).toEqual(correct);
    });
  });

  describe("find neightbours", () => {
    const grid = new Array(5).fill(new Array(5).fill(0)).map((row, x) =>
      row.map((cl, y) => {
        return { x, y };
      })
    );

    test("top-left corner", () => {
      const answer = getNeighbours({ x: 0, y: 0 }, grid).map((i) => {
        return { x: i.x, y: i.y };
      });

      const correct = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ];
      expect(answer).toEqual(correct);
    });

    test("top-right corner", () => {
      const answer = getNeighbours({ x: 4, y: 0 }, grid).map((i) => {
        return { x: i.x, y: i.y };
      });

      const correct = [
        { x: 1, y: 4 },
        { x: 0, y: 3 },
      ];
      expect(answer).toEqual(correct);
    });

    test("bottom-right corner", () => {
      const answer = getNeighbours({ x: 4, y: 4 }, grid).map((i) => {
        return { x: i.x, y: i.y };
      });

      const correct = [
        { x: 4, y: 3 },
        { x: 3, y: 4 },
      ];
      expect(answer).toEqual(correct);
    });

    test("bottom-left corner", () => {
      const answer = getNeighbours({ x: 4, y: 0 }, grid).map((i) => {
        return { x: i.x, y: i.y };
      });

      const correct = [
        { x: 1, y: 4 },
        { x: 0, y: 3 },
      ];
      expect(answer).toEqual(correct);
    });
  });
});
