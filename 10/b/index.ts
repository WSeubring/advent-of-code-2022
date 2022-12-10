import * as fs from "fs";
import _ from "lodash";

const isTouching = (
  head: [number, number],
  tail: [number, number]
): boolean => {
  const [headX, headY] = head;
  const [tailX, tailY] = tail;

  if (Math.abs(headX - tailX) > 1) return false;
  if (Math.abs(headY - tailY) > 1) return false;

  return Math.abs(headX - tailX) + Math.abs(headY - tailY) <= 2;
};

enum directions {
  up = "U",
  down = "D",
  left = "L",
  right = "R",
}

const getDirectionMovement = (direction: directions): [number, number] => {
  switch (direction) {
    case directions.up:
      return [0, 1];
    case directions.down:
      return [0, -1];
    case directions.left:
      return [-1, 0];
    case directions.right:
      return [1, 0];
  }
};

const printScratchPad = (scratchPad: Map<string, boolean>) => {
  const keys = [...scratchPad.keys()].map((key) =>
    key.split(",").map((x) => parseInt(x))
  );
  const minX = Math.min(...keys.map(([x, _y]) => x));
  const maxX = Math.max(...keys.map(([x, _y]) => x));
  const minY = Math.min(...keys.map(([_x, y]) => y));
  const maxY = Math.max(...keys.map(([_x, y]) => y));

  for (let y = maxY; y >= minY; y--) {
    let line = "";
    for (let x = minX; x <= maxX; x++) {
      if (scratchPad.get([x, y].toString()) === true) {
        line += "X";
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
};
const printRope = (rope: Array<[number, number]>) => {
  for (let y = -25; y < 25; y++) {
    let line = "";
    for (let x = -25; x < 25; x++) {
      const res = rope.map((e) => e.toString()).indexOf([x, y].toString());
      if (res === -1) {
        line += ".";
      } else {
        line += res;
      }
    }
    console.log(line);
  }
};
const result = (): number => {
  const path = "9/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  // x,y => visited by tail
  const scratchPad: Map<string, boolean> = new Map<string, boolean>();

  // Rope
  let rope: Array<[number, number]> = [
    [0, 0], // Head
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  // The tail always moves to the last position of the head, unless it touches the head
  lines.forEach((line) => {
    const [direction, stepsRaw] = line.split(" ");
    const steps = parseInt(stepsRaw);

    const currentDirectionMovement: [number, number] = getDirectionMovement(
      direction as directions
    );

    // Move each part of the rope
    for (let i = 0; i < steps; i++) {
      for (let index = 0; index < rope.length; index++) {
        if (index === 0) {
          rope[index] = [
            rope[index][0] + currentDirectionMovement[0],
            rope[index][1] + currentDirectionMovement[1],
          ];
        } else {
          if (!isTouching(rope[index - 1], rope[index])) {
            // Move next to the head on the closest direct side
            const xDiff = rope[index - 1][0] - rope[index][0];
            const yDiff = rope[index - 1][1] - rope[index][1];

            rope[index] = [
              rope[index][0] + (Math.abs(xDiff) / 2) * Math.sign(xDiff),
              rope[index][1] + (Math.abs(yDiff) / 2) * Math.sign(yDiff),
            ];
          }

          // Mark the tail position as visited
          if (index === rope.length - 1) {
            scratchPad.set(rope[index].toString(), true);
          }
        }
      }
    }
  });

  printScratchPad(scratchPad);

  // Return the total number of visited positions
  return scratchPad.size;
};

console.log(result());
