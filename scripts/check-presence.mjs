import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// Exercise the actual tile's asynchronous image hand-off with controlled
// decoding. This is a unit check, not a browser or visual layout check.
const requirePackage = createRequire(new URL("../package.json", import.meta.url));
const ts = requirePackage("typescript");
const source = readFileSync(new URL("../components/home/partner-photo-grid.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(`${source}\nexport { PartnerTile };`, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

let state;
let effect;
let cleanup;
let dependencies;
const requests = [];
class ControlledImage {
  decode() {
    return new Promise((resolve, reject) => requests.push({ image: this, resolve, reject }));
  }
}
const hooks = {
  useState(initial) {
    state ??= typeof initial === "function" ? initial() : initial;
    return [state, (update) => { state = typeof update === "function" ? update(state) : update; }];
  },
  useEffect(callback, nextDependencies) {
    if (dependencies?.every((value, index) => Object.is(value, nextDependencies[index]))) return;
    cleanup?.();
    dependencies = nextDependencies;
    effect = callback;
  },
};
const jsx = (type, props) => ({ type, props });
const mocks = {
  react: hooks,
  "react/jsx-runtime": { jsx, jsxs: jsx },
  "@/components/site-image": { default: "img" },
  "lucide-react": {},
  "@/lib/responsive-images": { responsiveImage: (src, sizes) => ({ srcSet: `${src} 440w`, sizes }) },
};
const unit = { exports: {} };
new Function("module", "exports", "require", "Image", compiled)(unit, unit.exports, (name) => {
  assert.ok(name in mocks, `Unexpected dependency: ${name}`);
  return mocks[name];
}, ControlledImage);
const photos = ["Trevo", "Bulltique", "Empório"].map((name) => ({ name, image: `/${name}.webp`, alt: name, position: "center" }));
const render = (turn, paused = false) => {
  const tree = unit.exports.PartnerTile({ photos, turn, paused, index: 0 });
  if (effect) { const callback = effect; effect = undefined; cleanup = callback(); }
  return tree;
};
const settle = async () => { await Promise.resolve(); await Promise.resolve(); };
const active = () => state.frames[state.front];

render(0);
assert.equal(active(), photos[0]);
assert.equal(requests.length, 0);
render(1);
assert.equal(active(), photos[0], "The outgoing photo remains visible while loading");
assert.equal(requests[0].image.src, photos[1].image);
assert.equal(requests[0].image.srcset, `${photos[1].image} 440w`);
requests[0].resolve(); await settle();
assert.equal(active(), photos[1]);
assert.equal(state.frames[0], photos[0], "Fade keeps the outgoing layer's original source");
const label = render(1).props["aria-label"];
assert.equal(label, photos[1].name, "Accessible name follows the displayed photo");

render(2);
assert.equal(active(), photos[1]);
requests[1].resolve(); await settle();
assert.equal(active(), photos[2]);
assert.equal(state.frames[1], photos[1], "Second fade also preserves its outgoing source");

render(3);
requests[2].reject(new Error("Missing asset")); await settle();
assert.equal(active(), photos[2], "Failed decoding never blanks or replaces the photo");

render(4);
render(5);
requests[3].resolve(); await settle();
assert.equal(active(), photos[2], "A stale request cannot replace a newer selection");
requests[4].resolve(); await settle();
assert.equal(active(), photos[2]);

render(6);
render(6, true);
requests[5].resolve(); await settle();
assert.equal(active(), photos[2], "Pause cancels a still-loading hand-off");
assert.equal(requests.length, 6);
render(6, false);
requests[6].resolve(); await settle();
assert.equal(active(), photos[0], "Resume can complete the interrupted hand-off");
cleanup?.();
console.log("Presence checks passed: decoded hand-off, repeated fades, failed assets, stale requests, pause/resume, accessible labels.");
