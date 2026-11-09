import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

// Run the real validators, SQL helpers and API handlers against disposable
// SQLite. No production credentials, requests or commercial records are used.
const root = fileURLToPath(new URL("../", import.meta.url));
const requirePackage = createRequire(path.join(root, "package.json"));
const ts = requirePackage("typescript");
const sqlite = new DatabaseSync(":memory:");
let user = null;
const env = {
  ARCO_ADMIN_EMAIL: "owner@example.test",
  DB: {
    prepare(sql) {
      const statement = sqlite.prepare(sql);
      return {
        bind(...values) {
          return {
            first: async () => statement.get(...values) ?? null,
            all: async () => ({ results: statement.all(...values) }),
            run: async () => statement.run(...values),
          };
        },
      };
    },
  },
};

function createLoader() {
  const cache = new Map();
  function load(file) {
    const filename = path.resolve(root, file);
    if (cache.has(filename)) return cache.get(filename).exports;
    const unit = { exports: {} };
    cache.set(filename, unit);
    const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
      fileName: filename,
    }).outputText;
    const localRequire = name => {
      if (name === "cloudflare:workers") return { env };
      if (name === "@/app/chatgpt-auth") return { getChatGPTUser: async () => user };
      if (name.startsWith("@/") || name.startsWith(".")) {
        const target = name.startsWith("@/") ? path.join(root, name.slice(2)) : path.resolve(path.dirname(filename), name);
        const source = [target, target + ".ts"].find(existsSync);
        if (!source) throw new Error("Missing application dependency: " + name);
        return load(source);
      }
      return requirePackage(name);
    };
    new Function("require", "module", "exports", compiled)(localRequire, unit, unit.exports);
    return unit.exports;
  }
  return load;
}

const load = createLoader();
const { catalogBrands } = load("lib/catalog-data.ts");
const { segments } = load("lib/form-options.ts");
const { leadSchema } = load("lib/leads.ts");
const { POST } = load("app/api/contatos/route.ts");
const { GET } = load("app/api/contatos/exportar/route.ts");
const { listLeads } = load("db/leads.ts");
const { catalogInquiryWhatsappUrl } = load("lib/catalog-inquiry.ts");
const fixture = {
  id: crypto.randomUUID(), source: "catalog", name: "Contato de teste",
  phone: "+55 (81) 99999-0000", company: "Loja de teste",
  city: "Recife", state: "PE", segment: segments[0],
  brand: catalogBrands[0].slug, demand: "",
};
const attribution = {
  entry_path: "/", referrer_host: "instagram.com",
  utm_source: "instagram", utm_medium: "social", utm_campaign: "primeiro-mix",
};
async function post(body, headers = {}) {
  return POST(new Request("https://arco.example.test/api/contatos", {
    method: "POST",
    headers: { Origin: "https://arco.example.test", "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  }));
}

try {
  sqlite.exec(readFileSync(path.join(root, "drizzle/0000_awesome_roulette.sql"), "utf8"));
  sqlite.prepare("INSERT INTO leads (id, source, name, phone, company, city, state, segment, brand, subject, demand, created_at, request_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
    crypto.randomUUID(), "catalog", "Contato antigo", "81999990000", "Loja antiga",
    "Recife", "PE", segments[0], catalogBrands[0].slug, "catalogo", "", "2026-10-08T12:00:00.000Z", "hash-antigo",
  );
  const old = sqlite.prepare("SELECT * FROM leads").get();
  sqlite.exec(readFileSync(path.join(root, "drizzle/0001_freezing_ultimo.sql"), "utf8"));
  const migrated = sqlite.prepare("SELECT * FROM leads WHERE id = ?").get(old.id);
  for (const [field, value] of Object.entries(old)) assert.equal(migrated[field], value);
  for (const field of Object.keys(attribution)) assert.equal(migrated[field], null);

  assert.equal((await post(fixture)).status, 201, "Existing payload without attribution still works");
  assert.equal((await post(fixture)).status, 201, "Retry is idempotent");
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM leads WHERE id = ?").get(fixture.id).n, 1);
  assert.equal((await post({ ...fixture, name: "Outro contato" })).status, 409);
  const tagged = { ...fixture, id: crypto.randomUUID(), attribution };
  assert.equal((await post(tagged)).status, 201);
  assert.equal((await post(tagged)).status, 201);
  const saved = sqlite.prepare("SELECT * FROM leads WHERE id = ?").get(tagged.id);
  for (const [field, value] of Object.entries(attribution)) assert.equal(saved[field], value);
  assert.equal(saved.phone, "81999990000");
  assert.equal(saved.cnpj, null);
  const attendance = { ...fixture, id: crypto.randomUUID(), source: "attendance", subject: "mix", cnpj: "00.000.000/0001-00", demand: "Conhecer produtos para minha loja", attribution };
  assert.equal((await post(attendance)).status, 201);
  assert.equal((await post({ ...attendance, id: crypto.randomUUID(), cnpj: "" })).status, 400);
  assert.equal((await post({ ...fixture, id: crypto.randomUUID(), phone: "123" })).status, 400);
  assert.equal((await post({ ...fixture, id: crypto.randomUUID(), website: "spam" })).status, 400);
  assert.equal((await post({ ...fixture, id: crypto.randomUUID(), attribution: { ...attribution, entry_path: "/?phone=private" } })).status, 400);
  assert.equal((await post(fixture, { Origin: "https://outside.example.test" })).status, 403);
  assert.equal((await post({ ...fixture, extra: "x".repeat(8192) })).status, 413);
  for (let i = 0; i < 10; i++) assert.equal((await post({ ...fixture, id: crypto.randomUUID() }, { "cf-connecting-ip": "192.0.2.10" })).status, 201);
  assert.equal((await post({ ...fixture, id: crypto.randomUUID() }, { "cf-connecting-ip": "192.0.2.10" })).status, 429);
  assert.ok(!sqlite.prepare("SELECT ip_hash FROM leads WHERE ip_hash != ''").all().some(row => row.ip_hash === "192.0.2.10"));
  const rows = await listLeads();
  assert.ok(rows.some(row => row.id === old.id && row.entry_path === null));
  const page = await listLeads(2);
  const following = await listLeads(2, { date: page.at(-1).created_at, id: page.at(-1).id });
  assert.ok(!following.some(row => page.some(first => first.id === row.id)));

  assert.equal((await GET()).status, 403, "Anonymous CSV denied");
  user = { userId: "other", email: "other@example.test" };
  assert.equal((await GET()).status, 403, "Other account denied");
  user = { userId: "owner", email: "OWNER@example.test" };
  assert.equal((await post({ ...fixture, id: crypto.randomUUID(), company: "=2+2" })).status, 201);
  const csvResponse = await GET();
  assert.equal(csvResponse.status, 200);
  assert.equal(csvResponse.headers.get("cache-control"), "private, no-store");
  const csv = await csvResponse.text();
  const header = csv.replace(/^\uFEFF/, "").split("\r\n")[0].split(";");
  assert.equal(header.length, 17);
  assert.equal(header[1], '"Origem"');
  assert.equal(header[11], '"CNPJ"');
  assert.ok(csv.includes('"instagram"'));
  assert.ok(csv.includes('"primeiro-mix"'));
  assert.ok(csv.includes("\"'=2+2\""), "Spreadsheet formulas remain neutralized");
  env.ARCO_ADMIN_EMAIL = "";
  assert.equal((await GET()).status, 403, "Missing owner configuration denies access");
  env.ARCO_ADMIN_EMAIL = "owner@example.test";

  const contact = { name: fixture.name, phone: saved.phone, company: fixture.company, city: fixture.city, state: fixture.state, segment: fixture.segment, demand: "Primeiro mix" };
  const whatsapp = new URL(catalogInquiryWhatsappUrl(catalogBrands[0], contact));
  const message = whatsapp.searchParams.get("text");
  for (const value of [contact.name, contact.phone, contact.company, contact.city, contact.demand, catalogBrands[0].name]) assert.ok(message.includes(value));
  assert.ok(!message.includes("CNPJ"));
  const anotherMessage = new URL(catalogInquiryWhatsappUrl(catalogBrands[1], contact)).searchParams.get("text");
  assert.ok(anotherMessage.includes(catalogBrands[1].name) && anotherMessage.includes(contact.company));
  const genericMessage = new URL(catalogInquiryWhatsappUrl(catalogBrands[0])).searchParams.get("text");
  assert.ok(genericMessage.includes(catalogBrands[0].name) && !genericMessage.includes(contact.company));

  const globalNames = ["window", "document", "sessionStorage"];
  const originals = new Map(globalNames.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  try {
    const storage = new Map();
    Object.defineProperty(globalThis, "window", { configurable: true, writable: true, value: { location: { href: "https://arco.example.test/?utm_source=instagram&utm_medium=social&utm_campaign=primeiro-mix&name=PessoaSecreta#private" } } });
    Object.defineProperty(globalThis, "document", { configurable: true, writable: true, value: { referrer: "https://instagram.com/private?email=secret" } });
    Object.defineProperty(globalThis, "sessionStorage", { configurable: true, writable: true, value: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } });
    const first = createLoader()("lib/contact-attribution.ts").captureContactAttribution();
    assert.deepEqual(first, attribution);
    const storedText = Array.from(storage.values()).join("");
    assert.ok(!storedText.includes("PessoaSecreta") && !storedText.includes("email=secret"));
    window.location.href = "https://arco.example.test/catalogos";
    document.referrer = "https://arco.example.test/";
    assert.deepEqual(createLoader()("lib/contact-attribution.ts").captureContactAttribution(), first, "First entry survives document navigation");
    const cached = JSON.parse(Array.from(storage.values())[0]);
    cached.createdAt = Date.now() - 25 * 60 * 60 * 1000;
    storage.set("arco-contact-origin-v1", JSON.stringify(cached));
    const fresh = createLoader()("lib/contact-attribution.ts").captureContactAttribution();
    assert.equal(fresh.entry_path, "/catalogos");
    assert.equal(fresh.referrer_host, "");
    sessionStorage.getItem = () => { throw new Error("Storage disabled"); };
    sessionStorage.setItem = () => { throw new Error("Storage disabled"); };
    const fallback = createLoader()("lib/contact-attribution.ts").captureContactAttribution();
    assert.ok(leadSchema.safeParse({ ...fixture, attribution: fallback }).success);
  } finally {
    for (const name of globalNames) {
      const original = originals.get(name);
      if (original) Object.defineProperty(globalThis, name, original);
      else delete globalThis[name];
    }
  }
  const { submitContact, ContactSubmissionError, contactSubmissionMessage } = load("lib/contact-submission.ts");
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "/api/contatos");
      return post(JSON.parse(options.body));
    };
    await submitContact(fixture);
    await assert.rejects(submitContact({ ...fixture, phone: "123", city: "" }), error => {
      assert.ok(error instanceof ContactSubmissionError);
      assert.match(error.message, /WhatsApp com DDD/);
      assert.match(error.message, /cidade/);
      assert.doesNotMatch(error.message, /Tente novamente|Invalid|String must/);
      return true;
    });
    await assert.rejects(submitContact({ ...fixture, id: "invalid" }), /Não conseguimos concluir o envio/);
    globalThis.fetch = async () => post(fixture, { Origin: "https://outside.example.test" });
    await assert.rejects(submitContact(fixture), error => {
      assert.match(error.message, /Seus dados continuam no formulário/);
      assert.doesNotMatch(error.message, /Origem não permitida/);
      return true;
    });
    assert.match(contactSubmissionMessage(new Error("Network unavailable")), /Confira sua conexão/);
  } finally {
    globalThis.fetch = originalFetch;
  }
  console.log("OK: migration preserves records; legacy and tagged submissions; idempotence; validation and limits; restricted CSV; pagination; contextual WhatsApp; first-entry attribution and disabled storage; actionable submission errors.");
} finally {
  sqlite.close();
}
