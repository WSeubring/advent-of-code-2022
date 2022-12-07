import * as fs from "fs";
import _ from "lodash";

const getUniqueMarkerIndex = (line: string) => {
  let idx = 0;
  const chunkSize = 4;
  while (idx < line.length - chunkSize) {
    const chunk = line.slice(idx, idx + chunkSize);
    if (_.uniq(chunk).length === chunkSize) {
      return idx + chunkSize;
    }
    idx += 1;
  }
  return -1;
};

const result = () => {
  const path = "6/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");
  const line = lines[0];

  const uniqueMarkerIndex = getUniqueMarkerIndex(line);

  return uniqueMarkerIndex;
};

console.log(result());
