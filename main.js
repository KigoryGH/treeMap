import chalk from "chalk";
import fs from "fs";
import path from "path";
import squarifyModule from 'squarify';
const squarify = squarifyModule.default;

const entries = fs.readdirSync(".");

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

for (const fName of entries) {
    console.log(fName, formatSize(getSize(fName)));
    info.push({ name: fName, value: getSize(fName) });
}

console.log(info);

const container = { x0: 0, y0: 0, x1: 40, y1: 15 };
const layout = squarify(info, container);
console.log(layout);