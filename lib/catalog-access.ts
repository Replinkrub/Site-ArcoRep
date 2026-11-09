const key = "arco-catalog-access-v1";
const lifetime = 90 * 24 * 60 * 60 * 1000;
export type CatalogAccess = "client" | "contact";

export function rememberedCatalogAccess(): CatalogAccess | null {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "null");
    if (saved?.expiresAt > Date.now() && (saved.access === "client" || saved.access === "contact")) return saved.access;
    localStorage.removeItem(key);
  } catch { /* Access still works when browser storage is disabled. */ }
  return null;
}
export function rememberCatalogAccess(access: CatalogAccess) {
  try { localStorage.setItem(key, JSON.stringify({ access, expiresAt: Date.now() + lifetime })); }
  catch { /* This is a convenience preference, never a contact database. */ }
}
export function forgetCatalogAccess() {
  try { localStorage.removeItem(key); } catch { /* Optional browser preference. */ }
}
