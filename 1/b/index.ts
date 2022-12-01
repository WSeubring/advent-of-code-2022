/**
 * Q1. What is the maximum number of calories a elf is carrying?
 *
 * Note:
 * Each elf list the number of calories in their inventory
 * Elf inventories are separated by a white line
 * */
import * as fs from "fs";
import _ from "lodash";

const getInventoriesFromFile = (path: string) => {
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  const inventories = lines.reduce<string[][]>(
    (acc, line) => {
      // Split on empty line
      if (_.isEmpty(line)) {
        acc.push([]);
      } else {
        acc[acc.length - 1].push(line);
      }
      return acc;
    },
    [[]]
  );

  return inventories;
};

const getTotalCaloriesOfInventory = (inventory: string[]): number => {
  return inventory.reduce((acc, item) => acc + parseInt(item), 0);
};

const result = (): number => {
  const inventories = getInventoriesFromFile("1/input");

  const caloriesPerInventory = inventories.map((inventory) =>
    getTotalCaloriesOfInventory(inventory)
  );

  const sortedByCalories = _.sortBy(
    caloriesPerInventory,
    // Sort in descending order
    (calories) => -calories
  );

  if (sortedByCalories === undefined) {
    throw new Error("No calories found");
  }

  // Return the combined result of the last 3 inventories
  return _.sum(sortedByCalories.slice(0, 3));
};

console.log(result());
