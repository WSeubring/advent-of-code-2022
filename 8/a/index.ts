import * as fs from "fs";
import _ from "lodash";

/**
 *
 * @returns
 */
const result = (): number => {
  const path = "8/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  const grid: number[][] = [];

  lines.forEach((line) => {
    grid.push(line.split("").map((char) => parseInt(char)));
  });

  // A tree is visible when it largest number to one of the sides.
  const nTrees = grid.reduce<number>((acc, row, rowIdx) => {
    const rowTrees = row.reduce((acc, cell, coldIdx) => {
      // On the edge
      if (
        coldIdx === 0 ||
        coldIdx === row.length - 1 ||
        rowIdx === 0 ||
        rowIdx === grid.length - 1
      ) {
        return acc + 1;
      }
      // Find the max tree length to the sides
      const maxLeft = Math.max(...row.slice(0, coldIdx));
      const maxRight = Math.max(...row.slice(coldIdx + 1));
      const maxTop = Math.max(
        ...grid.slice(0, rowIdx).map((row) => row[coldIdx])
      );
      const maxBottom = Math.max(
        ...grid.slice(rowIdx + 1).map((row) => row[coldIdx])
      );

      // If larger than any of the sides, it's a tree
      if (
        cell > maxLeft ||
        cell > maxRight ||
        cell > maxTop ||
        cell > maxBottom
      ) {
        return acc + 1;
      }

      return acc;
    }, 0);

    return acc + rowTrees;
  }, 0);

  return nTrees;
};

const answer = result();
const a = answer;
console.log(a);
