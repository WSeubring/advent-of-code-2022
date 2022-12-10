import * as fs from "fs";
import _ from "lodash";

enum Commands {
  addx = "addx",
  noop = "noop",
}
const getValuesPerCycle = (): number[] => {
  const path = "10/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  let hackyCaryOvervalue = 0;
  const valuesPerCycle = lines.reduce<number[]>((acc, line) => {
    const [command, value] = line.split(" ");
    const currentValue = (acc[acc.length - 1] ?? 0) + hackyCaryOvervalue;

    acc.push(currentValue);

    switch (command) {
      case Commands.addx:
        acc.push(currentValue);
        hackyCaryOvervalue = parseInt(value);
        break;
      case Commands.noop:
        hackyCaryOvervalue = 0;
    }

    return acc;
  }, []);

  return valuesPerCycle;
};

const valuesPerCycle = getValuesPerCycle();
console.log(valuesPerCycle);
const totalSignalStrength = valuesPerCycle.reduce((acc, val, i) => {
  const humanIndex = i + 1;
  if ([20, 60, 80, 100, 140, 180, 220].includes(humanIndex)) {
    return acc + val * humanIndex;
  }
  return acc;
});

console.log(totalSignalStrength);
