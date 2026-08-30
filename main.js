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
const grid = [];

for (const fName of entries) {
        info.push({ name: fName, value: getSize(fName) });
}

const container = { x0: 0, y0: 0, x1: 40, y1: 15 };
const layout = squarify(info, container);
for (let i = 0; i < container.y1; i++) {
    grid.push([]);
}

for (const rect of layout) {
    const startRow = Math.floor(rect.y0);
    const endRow = Math.floor(rect.y1);
    const startCol = Math.floor(rect.x0);
    const endCol = Math.floor(rect.x1);

    for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
            grid[row][col] = rect.name;
        }
    }
}
