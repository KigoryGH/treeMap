import chalk from "chalk";
import fs from "fs";
import path from "path";
import squarifyModule from "squarify";
const squarify = squarifyModule.default;

const entries = fs.readdirSync(".");
const colors = {
  file: "bgBlue",
  executable: "bgGreen",
  directory: "bgMagenta",
  symlink: "bgRed",
};

function formatSize(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000;
    unitIndex++;
  }

  return size.toFixed(1) + " " + units[unitIndex];
}

function getSize(path) {
  const stats = fs.statSync(path);

  if (!stats.isDirectory()) {
    return stats.size;
  }

  let total = 0;
  const children = fs.readdirSync(path);
  for (const child of children) {
    total += getSize(path + "/" + child);
  }
  return total;
}

const info = [];
const grid = [];

for (const fName of entries) {
  const stats = fs.statSync(fName);

  let type;
  if (stats.isDirectory()) {
    type = "directory";
  } else {
    type = "file";
  }

  info.push({
    name: fName,
    value: getSize(fName),
    type: type,
  });
}

const container = {
  x0: 0,
  y0: 0,
  x1: 40,
  y1: 15,
};
const layout = squarify(info, container);

for (let i = 0; i < container.y1; i++) {
  grid.push([]);
}

for (const rect of layout) {
const startRow = Math.floor(rect.y0);
const endRow = Math.min(Math.ceil(rect.y1), container.y1);
const startCol = Math.floor(rect.x0);
const endCol = Math.min(Math.ceil(rect.x1), container.x1);

  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      grid[row][col] = rect.name;
    }
  }
}

let unknown = [];

for (let row = 0; row < 15; row++) {
  for (let column = 0; column < 40; column++) {
    const fileName = grid[row][column];
    const match = info.find((item) => item.name === fileName);
    if (match) {
      process.stdout.write(chalk[colors[match.type]](" "));
    } else {
      process.stdout.write(chalk.bgWhite(" "));
      unknown.push(fileName);
    }
  }
  console.log();
}

console.log(unknown);

if (unknown.length > 0) {
  console.log(
    chalk.redBright.bold(
      "White blocks mean unknown file type — please open a GitHub issue so we can add support for it. Thanks",
    ),
  );
  console.log(
    chalk.bold("Unspported file name: ", chalk.yellowBright.bold(`${unknown}`)),
  );
}
