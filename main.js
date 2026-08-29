import chalk from "chalk";
import { squarify } from "squarify";
import fs from "fs"

const entries = fs.statSync(".")

for (const name of entries) {
const stats = fs.statSync(name);
    console.log(name, stats.size, stats.isDirectory());
}