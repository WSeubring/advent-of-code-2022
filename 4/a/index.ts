import * as fs from "fs";
import _ from "lodash";

/**
 * Q. find the number of sections falling within each others range
 */

const parseRangeStringToRange = (
  range: string
): { start: number; end: number } => {
  const rangeParts = range.split("-");

  return {
    start: parseInt(rangeParts[0]),
    end: parseInt(rangeParts[1]),
  };
};

const result = () => {
  const path = "4/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  const nContainedRanges = lines.reduce((acc, line) => {
    const ranges = line.split(",");

    const elfACleaningRange = parseRangeStringToRange(ranges[0]);
    const elfBCleaningRange = parseRangeStringToRange(ranges[1]);

    if (
      (elfACleaningRange.start >= elfBCleaningRange.start &&
        elfACleaningRange.end <= elfBCleaningRange.end) ||
      (elfBCleaningRange.start >= elfACleaningRange.start &&
        elfBCleaningRange.end <= elfACleaningRange.end)
    ) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return nContainedRanges;
};

console.log(result());
