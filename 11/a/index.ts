import * as fs from "fs";
import _ from "lodash";

class MonkeyManager {
  private monkeys: Monkey[];

  constructor(monkeys: Monkey[]) {
    this.monkeys = monkeys;
  }

  public addMonkey(monkey: Monkey) {
    this.monkeys.push(monkey);
  }

  public getMonkey(idx: number) {
    // Monkey 0 is the first monkey ( where the count starts at 1)
    return this.monkeys[idx];
  }

  public getMonkeys() {
    return this.monkeys;
  }

  public print() {
    this.monkeys.forEach((monkey, i) => {
      console.log(i, monkey);
    });
  }
}

/** Example file input of a monkey
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3
*/

class Monkey {
  public items: number[];
  private operation: (val: number) => number;
  private testValue: number;
  private targets: number[];
  private inspectCount = 0;
  private monkeyManager: MonkeyManager;

  constructor(
    items: number[],
    operation: (val: number) => number,
    testValue: number,
    targets: number[],
    monkeyManager: MonkeyManager
  ) {
    this.items = items;
    this.operation = operation;
    this.testValue = testValue;
    this.targets = targets;
    this.monkeyManager = monkeyManager;
  }

  private getTargetMonkey(testResult: boolean) {
    if (testResult === true) {
      return this.monkeyManager.getMonkey(this.targets[0]);
    }
    return this.monkeyManager.getMonkey(this.targets[1]);
  }

  private test(value: number) {
    return value % this.testValue === 0;
  }

  private throwItem(itemWorryLevel: number) {
    if (itemWorryLevel === undefined) {
      console.log("No item to throw");
      return;
    }
    this.inspectCount += 1;
    const inspectedItemWorryLevel = this.operation(itemWorryLevel);
    const notDamagedWorryLevel = Math.floor(inspectedItemWorryLevel / 3);
    const isDividable = this.test(notDamagedWorryLevel);
    const targetMonkey = this.getTargetMonkey(isDividable);
    targetMonkey.receiveItem(notDamagedWorryLevel);
  }

  public getInspectCount() {
    return this.inspectCount;
  }

  public receiveItem(item: number) {
    this.items.push(item);
  }

  public ThrowItems() {
    const length = this.items.length;
    for (let i = 0; i < length; i++) {
      const itemWorryLevel = this.items.shift();
      if (itemWorryLevel === undefined) {
        console.log("No item to throw");
        return;
      }
      this.throwItem(itemWorryLevel);
    }
  }
}

const playMonkeyRounds = () => {
  const path = "11/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  //Parse monkey from the lines of the files
  const monkeyManager = new MonkeyManager([]);
  lines.forEach((line, i) => {
    if (_.isEmpty(line)) {
      return;
    }
    if (line.startsWith("Monkey")) {
      // Create a monkey
      const startingItems = parseStartingItems(lines[i + 1]);
      const operation = parseOperation(lines[i + 2]);
      const testValue = parseTestValue(lines[i + 3]);
      // Parse both lines
      const targets = parseTargets([lines[i + 4], lines[i + 5]]);
      const monkey = new Monkey(
        startingItems,
        operation,
        testValue,
        targets,
        monkeyManager
      );
      monkeyManager.addMonkey(monkey);
    }
  });

  const nRounds = 20;
  for (let i = 0; i < nRounds; i++) {
    monkeyManager.getMonkeys().forEach((monkey, i) => {
      monkey.ThrowItems();
    });
  }

  console.log("Final state");
  monkeyManager.print();

  const counts = monkeyManager
    .getMonkeys()
    .map((monkey) => monkey.getInspectCount());

  counts.sort((a, b) => b - a);
  console.log(counts[0] * counts[1]);
};

const parseStartingItems = (line: string) => {
  return line
    .split(":")[1]
    .split(",")
    .map((item) => parseInt(item));
};

// Operation can be +, -, * or / by a number
const parseOperation = (line: string) => {
  const operationFunction = (val: number) => {
    const operationLineParts = line.split("=")[1].split(" ");
    const operationType = operationLineParts[operationLineParts.length - 2];
    const worryLevelChange =
      operationLineParts[operationLineParts.length - 1] === "old"
        ? val
        : parseInt(operationLineParts[operationLineParts.length - 1]);

    switch (operationType) {
      case "+":
        return val + worryLevelChange;
      case "-":
        return val - worryLevelChange;
      case "*":
        return val * worryLevelChange;
      case "/":
        return val / worryLevelChange;
      default:
        throw new Error("Invalid operation");
    }
  };

  return operationFunction;
};

const parseTestValue = (line: string) => {
  const parts = line.split(" ");
  return parseInt(parts[parts.length - 1]);
};

const parseTargets = (lines: string[]) => {
  const targets = lines.map((line) => {
    const lineParts = line.split(" ");
    const target = parseInt(lineParts[lineParts.length - 1]);
    return target;
  });
  return targets;
};

playMonkeyRounds();
