
console.log("loading?")

import * as hello_wasm from "../../pkg/hello_wasm.js"

console.log("hi")

await hello_wasm.default()
console.log(hello_wasm.greet())
