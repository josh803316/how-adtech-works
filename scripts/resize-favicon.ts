import sharp from "sharp";
import { renameSync } from "node:fs";
import { join } from "node:path";

const dir = import.meta.dir;
const publicDir = join(dir, "..", "public");
const input = join(publicDir, "favicon.png");
const tmp = join(publicDir, "favicon-32.png");

await sharp(input).resize(32, 32).png().toFile(tmp);
renameSync(tmp, input);
console.log("Resized favicon to 32x32");
