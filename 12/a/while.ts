import * as fs from "fs";
import _ from "lodash";

const path = "12/input";
const file = fs.readFileSync(path, "utf8");
const lines = file.split("\n");

type Node = {
  x: number;
  y: number;
  parent: Node | null;
};

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

const breadFirstSearch = (grid: number[][], startNode: Node) => {
  const queue = [startNode];
  const visited = new Map();
  visited.set(`${startNode.x},${startNode.x}`, true);

  while (queue.length > 0) {
    const node = queue.shift()!;
    const cell = grid[node.y][node.x];

    if (cell === 26) {
      return node;
    }

    const options = {
      left: { x: node.x - 1, y: node.y },
      right: { x: node.x + 1, y: node.y },
      top: { x: node.x, y: node.y - 1 },
      bottom: { x: node.x, y: node.y + 1 },
    };

    const optionValues = Object.values(options);
    const nextOptions = optionValues.filter((c) => {
      const nextCell = grid?.[c.y]?.[c.x];
      return nextCell !== undefined && nextCell <= cell + 1;
    });

    nextOptions.forEach((option) => {
      const key = `${option.x},${option.y}`;
      if (visited.get(key) !== true) {
        visited.set(key, true);
        queue.push({ ...option, parent: node });
      }
    });
  }
};

const node = breadFirstSearch(grid, { x: startX, y: startY, parent: null });

if (node === undefined) {
  throw new Error("No path found");
}

let currentNode: Node | null = node;
let count = 0;
while (currentNode !== null) {
  count++;
  console.log(
    "x y",
    currentNode.x,
    currentNode.y,
    "value",
    grid[currentNode.y][currentNode.x]
  );
  const gridCopy: any = _.cloneDeep(grid);
  gridCopy[currentNode.y][currentNode.x] = "X";
  console.log(gridCopy.map((row: any[]) => row.join(" ")).join("\n"));
  console.log("\n");
  currentNode = currentNode.parent;
}
console.log(count - 1); //- start
