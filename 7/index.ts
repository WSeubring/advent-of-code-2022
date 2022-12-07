import * as fs from "fs";
import _ from "lodash";

type File = {
  size: number;
};

type Directory = {
  name: string;
  children: Directory[];
  files: File[];
  parent: Directory | null;
};

enum Commands {
  cd = "cd",
  ls = "ls",
}

const result = (): Directory | null => {
  const path = "7/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  let rootDir: Directory | null = null;
  let currentDir: Directory | null = null;
  lines.forEach((line) => {
    const prefix = line.split(" ")[0];
    const command = line.split(" ")[1];
    const dirName = line.split(" ")[2];
    if (command === Commands.cd) {
      if (dirName === "..") {
        currentDir = currentDir?.parent ?? null;
        return;
      }
      const dir: Directory = {
        name: dirName,
        children: [],
        files: [],
        parent: currentDir,
      };
      if (rootDir === null) {
        rootDir = dir;
      } else {
        currentDir?.children.push(dir);
      }
      currentDir = dir;
    }
    if (!isNaN(parseInt(prefix))) {
      currentDir?.files.push({
        size: parseInt(prefix),
      });
    }
  });

  return rootDir;
};
const sum = (dir: Directory): number => {
  let sumVal = 0;
  dir.files.forEach((file) => {
    sumVal += file.size;
  });
  dir.children.forEach((child) => {
    sumVal += sum(child);
  });
  return sumVal;
};

const getDirSizes = (dir: Directory | null): number[] => {
  if (dir === null) {
    return [];
  }

  const sizes = [sum(dir)];
  dir.children.forEach((child) => {
    sizes.push(...getDirSizes(child));
  });

  return sizes;
};

const dir = result();

if (dir === null) {
  throw new Error("No result");
}

//A
console.log(_.sum(getDirSizes(dir).filter((size) => size <= 100000)));

//B
const totalDiskSize = 70000000;
const currentSize = getDirSizes(dir)[0]; //Root dir size
const requiredSize = 30000000 - (totalDiskSize - currentSize);
console.log(
  getDirSizes(dir)
    .filter((size) => size >= requiredSize)
    .sort()
    .at(-1)
);
