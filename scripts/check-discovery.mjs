import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Verify real routing, filters and access preferences without production writes
// or a browser. Component trees below do not verify CSS or visual layout.
const root = fileURLToPath(new URL("../", import.meta.url));
const requirePackage = createRequire(path.join(root, "package.json"));
const ts = requirePackage("typescript");
let slots = [];
let cursor = 0;
const jsx = (type, props) => ({ type, props });
const hooks = {
  useState(initial) {
    const index = cursor++;
    if (!(index in slots)) slots[index] = typeof initial === "function" ? initial() : initial;
    return [slots[index], update => { slots[index] = typeof update === "function" ? update(slots[index]) : update; }];
  },
  useMemo: fn => fn(), lazy: () => "dialog", Suspense: "suspense",
};
const mocks = {
  react: hooks, "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "fragment" },
  "next/navigation": { notFound: () => { throw new Error("not-found"); }, redirect: destination => { throw new Error(`redirect:${destination}`); } },
  "lucide-react": new Proxy({}, { get: (_, name) => String(name) }),
  "@/components/site-image": { default: "img" }, "@/components/site-link": { default: "a" },
  "@/components/site-header": { SiteHeader: "header" }, "@/components/site-footer": { SiteFooter: "footer" },
  "@/components/ui/button": { Button: "button" }, "@/components/ui/input": { Input: "input" },
  "@/components/ui/native-select": { NativeSelect: "select" },
  "@/components/ui/toggle-group": { ToggleGroup: "toggle-group", ToggleGroupItem: "toggle-item" },
};
const cache = new Map();
function load(file) {
  const filename = path.resolve(root, file);
  if (cache.has(filename)) return cache.get(filename).exports;
  const unit = { exports: {} }; cache.set(filename, unit);
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX }, fileName: filename,
  }).outputText;
  new Function("require", "module", "exports", compiled)(name => {
    if (name in mocks) return mocks[name];
    if (name.startsWith("@/") || name.startsWith(".")) {
      const base = name.startsWith("@/") ? path.join(root, name.slice(2)) : path.resolve(path.dirname(filename), name);
      const source = [base, base + ".ts", base + ".tsx"].find(existsSync);
      assert.ok(source, `Missing source ${name}`);
      return load(source);
    }
    return requirePackage(name);
  }, unit, unit.exports);
  return unit.exports;
}
function nodes(tree) {
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  if (!tree || typeof tree !== "object") return [];
  return [tree, ...nodes(tree.props?.children)];
}
function words(tree) {
  if (Array.isArray(tree)) return tree.map(words).join("");
  if (typeof tree === "string" || typeof tree === "number") return String(tree);
  return tree?.props ? words(tree.props.children) : "";
}
function render(Component, props = {}) { cursor = 0; return Component(props); }
function reset() { slots = []; cursor = 0; }

const { catalogBrands } = load("lib/catalog-data.ts");
const { markets, brandPages, brandPath, catalogPath, brandsForMarket, resolveCatalogSelection } = load("lib/brand-pages.ts");
const { attendanceUrl, resolveAttendanceSegment } = load("lib/attendance.ts");
const brandPage = load("app/representadas/[slug]/page.tsx");
assert.deepEqual(brandPage.generateStaticParams().map(item => item.slug), catalogBrands.map(item => item.slug));
assert.deepEqual(resolveCatalogSelection("unknown", "unknown"), { brand: "", market: "" });
assert.equal(catalogPath(), "/catalogos");
assert.equal(resolveAttendanceSegment("<script>"), "");
for (const brand of catalogBrands) {
  const content = brandPages[brand.slug];
  assert.ok(content?.lines.length >= 3, `${brand.name} has its own product lines`);
  assert.equal(brandPath(brand), `/representadas/${brand.slug}`);
  for (const asset of [brand.logo, brand.coverImage, ...brand.catalogs.map(item => item.href)].filter(Boolean)) {
    const file = path.join(root, "public", asset);
    assert.ok(existsSync(file), `Missing asset ${asset}`);
    if (asset.endsWith(".pdf")) assert.ok(statSync(file).size < 25 * 1024 * 1024);
  }
  const params = Promise.resolve({ slug: brand.slug });
  const props = { params, searchParams: Promise.resolve({}) };
  const tree = await brandPage.default(props);
  const elements = nodes(tree);
  assert.equal(elements.filter(node => node.type === "h1").length, 1);
  assert.ok(elements.some(node => node.type === "a" && node.props.href === "/catalogos"), "Each landing has a direct all-catalog link");
  assert.ok(elements.some(node => node.type?.name === "CatalogAccessButton" && node.props.brand.slug === brand.slug), "Catalog opens on the landing without a mandatory redirect");
  assert.ok((await brandPage.generateMetadata(props)).title.includes(brand.name));
  const market = markets.find(item => item.slug === content.markets[0]);
  const contextual = await brandPage.default({ params, searchParams: Promise.resolve({ mercado: market.slug }) });
  const inquiry = nodes(contextual).find(node => node.type === "a" && node.props.href?.startsWith("/atendimento?"));
  const query = new URL(inquiry.props.href, "https://example.test").searchParams;
  assert.equal(query.get("marca"), brand.slug);
  assert.equal(query.get("segmento"), market.segment);
}
await assert.rejects(() => brandPage.default({ params: Promise.resolve({ slug: "missing" }), searchParams: Promise.resolve({}) }), /not-found/);
assert.ok(!catalogBrands.some(brand => brand.slug === "prime-grill"), "Retired brand is absent from the shared active portfolio");
await assert.rejects(() => brandPage.default({ params: Promise.resolve({ slug: "prime-grill" }), searchParams: Promise.resolve({}) }), /redirect:\/representadas/);
for (const market of markets) {
  assert.ok(brandsForMarket(market.slug).length > 0);
  assert.ok(existsSync(path.join(root, "public", market.image)));
  assert.equal(new URL(attendanceUrl("mix", undefined, market.segment), "https://example.test").searchParams.get("segmento"), market.segment);
}

// The pilot keeps brand and market context through both catalog and contact links.
const { CantagalloShowcase } = load("components/cantagallo-showcase.tsx");
const { cantagalloLines } = load("lib/cantagallo.ts");
const cantagallo = catalogBrands.find(brand => brand.slug === "emporio-cantagallo");
const selectedMarket = markets.find(market => market.slug === "acougues");
const showcase = nodes(CantagalloShowcase({ brand: cantagallo, market: selectedMarket }));
for (const line of cantagalloLines) assert.ok(existsSync(path.join(root, "public", line.image)), `Missing original product image ${line.image}`);
const marketLinks = showcase.filter(node => node.type === "a" && node.props.href?.startsWith("/catalogos?"));
assert.equal(marketLinks.length, 3);
for (const link of marketLinks) {
  const selection = new URL(link.props.href, "https://example.test").searchParams;
  assert.equal(selection.get("marca"), cantagallo.slug);
  assert.ok(brandPages[cantagallo.slug].markets.includes(selection.get("mercado")));
}
for (const link of showcase.filter(node => node.type === "a" && node.props.href?.startsWith("/atendimento?"))) {
  const query = new URL(link.props.href, "https://example.test").searchParams;
  assert.equal(query.get("marca"), cantagallo.slug);
  assert.equal(query.get("segmento"), selectedMarket.segment);
}
assert.ok(showcase.some(node => node.type === "a" && node.props.href === "https://arcorep.meuspedidos.com.br/solicitar-acesso"), "New buyers can request Mercos access");
assert.equal(showcase.filter(node => node.type === "details").length, 3, "Purchase questions work without client JavaScript");

const { CatalogExplorer } = load("components/catalog/catalog-explorer.tsx");
const cards = tree => nodes(tree).filter(node => node.type?.name === "BrandCard");
reset();
let tree = render(CatalogExplorer);
assert.equal(cards(tree).length, catalogBrands.length, "The direct catalog route shows every brand by default");
assert.equal(nodes(tree).find(node => node.type === "details").props.open, false, "Extra filters stay optional on the fast route");
nodes(tree).find(node => node.props?.id === "catalog-brand-filter").props.onChange({ target: { value: "emporio-cantagallo" } });
tree = render(CatalogExplorer);
assert.deepEqual(cards(tree).map(node => node.props.brand.slug), ["emporio-cantagallo"]);
nodes(tree).find(node => node.type === "button" && words(node).includes("Ver todos os catálogos")).props.onClick();
tree = render(CatalogExplorer);
assert.equal(cards(tree).length, catalogBrands.length, "Clear returns to every catalog");
nodes(tree).find(node => node.props?.id === "catalog-market-filter").props.onChange({ target: { value: "alimentacao" } });
tree = render(CatalogExplorer);
assert.deepEqual(cards(tree).map(node => node.props.brand.slug), brandsForMarket("alimentacao").map(brand => brand.slug));
const selectedCard = cards(tree)[0];
const cardTree = selectedCard.type(selectedCard.props);
nodes(cardTree).find(node => node.type === "button").props.onClick({ currentTarget: { focus() {} } });
tree = render(CatalogExplorer);
assert.equal(nodes(tree).find(node => node.type === "dialog").props.initialSegment, markets.find(item => item.slug === "alimentacao").segment);

// Both the catalog hub and the optional landings read the same anonymous
// preference. No name, WhatsApp or CNPJ is persisted in the browser.
const store = new Map();
const originalStorage = globalThis.localStorage;
globalThis.localStorage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value), removeItem: key => store.delete(key) };
try {
  const access = load("lib/catalog-access.ts");
  access.rememberCatalogAccess("contact");
  assert.equal(access.rememberedCatalogAccess(), "contact");
  const { CatalogAccessButton } = load("components/catalog/catalog-access-button.tsx");
  for (const brand of catalogBrands.slice(0, 2)) {
    reset();
    let button = render(CatalogAccessButton, { brand });
    nodes(button).find(node => node.type === "button").props.onClick({ currentTarget: { focus() {} } });
    button = render(CatalogAccessButton, { brand });
    assert.equal(nodes(button).find(node => node.type === "dialog").props.access, "contact", "Another brand does not ask for identification again");
  }
  const saved = JSON.parse([...store.values()][0]);
  assert.deepEqual(Object.keys(saved).sort(), ["access", "expiresAt"]);
  access.forgetCatalogAccess();
  assert.equal(access.rememberedCatalogAccess(), null);
  store.set("arco-catalog-access-v1", "broken-json");
  assert.equal(access.rememberedCatalogAccess(), null);
} finally { if (originalStorage === undefined) delete globalThis.localStorage; else globalThis.localStorage = originalStorage; }

console.log(`Discovery checks passed: ${catalogBrands.length} active brand pages, Cantagallo original assets and purchase paths, retired-brand redirect, market filters, contextual contact links and shared anonymous access preference.`);
