import chalk from "chalk";
import { squarify } from "squarify";
import fs from "fs"
import path from "path";

const entries = fs.readdirSync(".")

function formatSize(bytes) {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return size.toFixed(1) + " " + units[unitIndex];
}

const info=[]

for (const name of entries) {
const stats = fs.statSync(name);
    console.log(name, formatSize(getSize(name)),);
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