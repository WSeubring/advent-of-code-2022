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

const getBadges = (rucksacks: string[]) => {
  const badges: string[] = [];
  for (let i = 0; i < rucksacks.length; i += 3) {
    const elf1 = rucksacks[i];
    const elf2 = rucksacks[i + 1];
    const elf3 = rucksacks[i + 2];

    const badge = getOverlappingItems(
      elf1,
      getOverlappingItems(elf2, elf3).join()
    )[0];

    badges.push(badge);
  }
  return badges;
};

const result = () => {
  const path = "3/input";
  const file = fs.readFileSync(path, "utf8");
  const rucksacks = file.split("\n");

  const badges = getBadges(rucksacks);
  const badgePriorities = badges.map((badge) => getTotalPriority([badge]));

  return _.sum(badgePriorities);
};

console.log(result());
