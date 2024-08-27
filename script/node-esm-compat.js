import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const filePath = new URL("../pkg/cubing_rust_wasm.js", import.meta.url);

let modified = false; // For idempotence

let contents = await readFile(filePath, "utf-8");
const lines = [];
for (const line of contents.split("\n")) {
	if (line.trim() === "input = fetch(input);") {
		lines.push(`        try {
            input = await fetch(input);
        } catch (e) {
            if (!(e instanceof TypeError)) {
                throw e;
            }
            input = await globalThis.process.getBuiltinModule("node:fs/promises").readFile(input);
        }`);
		modified = true;
	} else {
		lines.push(line);
	}
}
if (modified) {
	contents = lines.join("\n");
	await writeFile(filePath, contents);
}
