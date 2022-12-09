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

const result = (): number => {
  const path = "9/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  // x,y => visited by tail
  const scratchPad: Map<string, boolean> = new Map<string, boolean>();

  let head: [number, number] = [0, 0];
  let tail: [number, number] = [0, 0];

  // The tail always moves to the last position of the head, unless it touches the head
  lines.forEach((line) => {
    const [direction, stepsRaw] = line.split(" ");
    const steps = parseInt(stepsRaw);

    const currentDirectionMovement: [number, number] = getDirectionMovement(
      direction as directions
    );

    for (let i = 0; i < steps; i++) {
      const prevHead = head;
      head = [
        head[0] + currentDirectionMovement[0],
        head[1] + currentDirectionMovement[1],
      ];

      if (!isTouching(head, tail)) {
        tail = prevHead;
      }
      // Mark the tail position as visited
      scratchPad.set(tail.toString(), true);
    }
  });
  printScratchPad(scratchPad);
  // Return the total number of visited positions
  return scratchPad.size;
};

console.log(result());
