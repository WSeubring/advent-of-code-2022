import * as fs from "fs";
import _ from "lodash";

/**
 * Q. find the number of sections falling with overlap
 */

type Range = {
  start: number;
  end: number;
};

const parseRangeStringToRange = (range: string): Range => {
  const rangeParts = range.split("-");

  return {
    start: parseInt(rangeParts[0]),
    end: parseInt(rangeParts[1]),
  };
};

/**
 *  Counts the distance of overlapping sections, this can as be a negative which indicated the distance between overlap
 */
const getDistanceOverlapping = (rangeA: Range, rangeB: Range) => {
  return (
    Math.min(rangeA.end, rangeB.end) - Math.max(rangeA.start, rangeB.start) + 1
  );
};

const isOverlapping = (rangeA: Range, rangeB: Range) => {
  const distanceOverlapping = getDistanceOverlapping(rangeA, rangeB);
  // If there is a positive distance, then the sections overlap
  return distanceOverlapping > 0;
};

const result = () => {
  const path = "4/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  const nContainedRanges = lines.reduce((acc, line) => {
    const ranges = line.split(",");

    const elfARange = parseRangeStringToRange(ranges[0]);
    const elfBRange = parseRangeStringToRange(ranges[1]);

    return isOverlapping(elfARange, elfBRange) ? acc + 1 : acc;
  }, 0);

  return nContainedRanges;
};

console.log(result());
