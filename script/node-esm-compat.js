import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const filePath = new URL("../pkg/cubing_rust_wasm.js", import.meta.url);

let modified = false; // For idempotence

let contents = await readFile(filePath, "utf-8");
const lines = [`// Mangled so that bundlers don't try to inline the source.
const node_fs_promises_mangled = "node:-fs/pr-omises";
const node_fs_promises_unmangled = () => node_fs_promises_mangled.replace(/-/g, "");
`];
for (const line of contents.split("\n")) {
  if (line.trim() === "input = fetch(input);") {
    lines.push(`        try {
            input = await fetch(input);
        } catch (e) {
            if (!(e instanceof TypeError)) {
                throw e;
            }
            input = await (await import(node_fs_promises_unmangled())).readFile(input);
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
