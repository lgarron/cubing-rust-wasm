
console.log("loading…")

import {Alg} from "https://cdn.cubing.net/js/cubing/alg";
import {default as init, internal_init, invert_alg} from "./hello_wasm.js"

console.log("Initializating WASM")

await init()
await internal_init()

console.log("Initialized!")
console.log("Inverted alg test:", invert_alg("R U R'"))

const input = document.querySelector(".input");
function register(elem, f) {
  const output = elem.querySelector(".output");
  input.addEventListener("input", () => {
    try {
      output.textContent = f(input.value);
      output.classList.remove("error");
    } catch(e) {
      output.textContent = e;
      output.classList.add("error");
    }
  })
}

register(document.querySelector("#rust"), invert_alg)
register(document.querySelector("#js"), (s) => {
  return new Alg(s).invert().toString()
})
