import * as fs from "fs";
import _ from "lodash";

const getOverlappingItems = (
  compartmentA: string,
  compartmentB: string
): string[] => {
  const overlappingItems: string[] = [];

  // Naive approach
  for (let i = 0; i < compartmentA.length; i++) {
    for (let j = 0; j < compartmentB.length; j++) {
      if (compartmentA[i] === compartmentB[j]) {
        overlappingItems.push(compartmentA[i]);
      }
    }
  }

  return _.uniq(overlappingItems);
};

const getTotalPriority = (overlappingItems: string[]): number => {
  const totalPriority = _.sum(
    overlappingItems.map((item) => {
      // A-Za-z are in sequence with char codes. We can use this to determine the priority
      const charPriority = item.toUpperCase().charCodeAt(0) - 64;
      const capitalPriority = item === item.toUpperCase() ? 26 : 0;
      return charPriority + capitalPriority;
    })
  );
  return totalPriority;
};

const result = () => {
  const path = "3/input";
  const file = fs.readFileSync(path, "utf8");
  const rucksacks = file.split("\n");

  const rucksacksPriority = rucksacks.map((rucksack) => {
    const halfwayIndex = rucksack.length / 2;
    const compartmentA = rucksack.slice(0, halfwayIndex);
    const compartmentB = rucksack.slice(halfwayIndex, rucksack.length);

    const overlappingItems = getOverlappingItems(compartmentA, compartmentB);
    const totalPriority = getTotalPriority(overlappingItems);

    return totalPriority;
  });

  return _.sum(rucksacksPriority);
};

console.log(result());
