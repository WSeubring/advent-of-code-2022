import * as fs from "fs";
import _ from "lodash";
let currentBest = 970;
const findPathLength = (
  grid: number[][],
  x: number,
  y: number,
  pathLength: number,
  visited: Map<string, boolean>
): number => {
  const cell = grid[y][x];
  console.log(cell, pathLength);
  const key = `${x},${y}`;
  if (visited.get(key) === true || pathLength > currentBest) {
    return 100000000;
  }
  if (cell === 26) {
    if (currentBest) {
      currentBest = pathLength;
    }
    return pathLength;
  }

  const options = {
    left: { x: x - 1, y },
    right: { x: x + 1, y },
    top: { x, y: y - 1 },
    bottom: { x, y: y + 1 },
  };

  const optionValues = Object.values(options);
  const nextOptions = optionValues
    .filter((c) => {
      const nextCell = grid?.[c.y]?.[c.x];
      return (
        nextCell !== undefined &&
        nextCell <= cell + 1 &&
        visited.get(key) !== true
      );
    })
    .sort((a, b) => grid?.[b.y]?.[b.x] - grid?.[a.y]?.[a.x]);

  const newMap = new Map(visited).set(key, true);
  if (nextOptions.length === 0) {
    return currentBest;
  }
  const result = nextOptions.map(({ x, y }) => {
    return findPathLength(grid, x, y, pathLength + 1, newMap);
  });
  return result.length > 0 ? Math.min(...result) : result[0];
};

const result = () => {
  const path = "12/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  const grid: number[][] = [];
  let startX = 0;
  let startY = 0;

  lines.forEach((line, y) => {
    grid.push(
      line.split("").map((char, x) => {
        if (char === "S") {
          startX = x;
          startY = y;
          return -1;
        }
        if (char === "E") {
          return 26;
        }
        return char.charCodeAt(0) - 97;
      })
    );
  });
  console.log(grid);
  console.log(startX, startY);
  const shortedPathLength = findPathLength(
    grid,
    startX,
    startY,
    0,
    new Map<string, boolean>()
  );

  console.log("shortedPathLength:", shortedPathLength);
};

result();
