import * as fs from "fs";
import _ from "lodash";

const getNVisibleTrees = (trees: number[], myValue: number) => {
  // Normal loop would have been nicer!
  const result = trees.reduce<number>((acc, cell, idx, arr) => {
    if (cell < myValue) {
      if (idx === trees.length) {
        return acc;
      }
      return acc + 1;
    }

    if (idx != trees.length) {
      arr.splice(1);
      return acc + 1;
    }
    arr.splice(1);
    return acc;
  }, 0);
  return result;
};

const result = (): number[] => {
  const path = "8/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  const grid: number[][] = [];

  lines.forEach((line) => {
    grid.push(line.split("").map((char) => parseInt(char)));
  });

  // A tree is visible when it largest number to one of the sides.
  const scenicScores = grid.reduce<number[]>((acc, row, rowIdx) => {
    const rowTrees = row.map((col, coldIdx) => {
      const myValue = col;
      // Compute the visible trees for each side, a tree equal size of larger than the starting point blocks the view to the other trees
      const treesLeft = row.slice(0, coldIdx).reverse();
      const treesRight = row.slice(coldIdx + 1);
      const treesTop = grid
        .slice(0, rowIdx)
        .map((row) => row[coldIdx])
        .reverse();
      const treesBottom = grid.slice(rowIdx + 1).map((row) => row[coldIdx]);

      const visibleTreesLeft = getNVisibleTrees(treesLeft, myValue);
      const visibleTreesRight = getNVisibleTrees(treesRight, myValue);
      const visibleTreesTop = getNVisibleTrees(treesTop, myValue);
      const visibleTreesBottom = getNVisibleTrees(treesBottom, myValue);

      const scenicScore =
        visibleTreesLeft *
        visibleTreesRight *
        visibleTreesTop *
        visibleTreesBottom;

      return scenicScore;
    }, 0);

    return [...acc, ...rowTrees];
  }, []);

  return scenicScores;
};

const scenicScores = result();
const b = _.max(scenicScores);
console.log(b);
