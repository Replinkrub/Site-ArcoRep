export type ContactAttribution = {
  entry_path: string;
  referrer_host: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

const key = "arco-contact-origin-v1";
const lifetime = 24 * 60 * 60 * 1000;
let current: ContactAttribution | undefined;

const clean = (value: string | null, limit: number) => (value ?? "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, limit);

export function attributionFromEntry(url: string, referrer: string): ContactAttribution {
  const entry = new URL(url);
  let referrerHost = "";
  try {
    const previous = new URL(referrer);
    if (["http:", "https:"].includes(previous.protocol) && previous.origin !== entry.origin) referrerHost = previous.hostname;
  } catch { /* Direct visits and embedded browsers may have no referrer. */ }
  return {
    entry_path: clean(entry.pathname, 240),
    referrer_host: clean(referrerHost, 240),
    utm_source: clean(entry.searchParams.get("utm_source"), 120),
    utm_medium: clean(entry.searchParams.get("utm_medium"), 120),
    utm_campaign: clean(entry.searchParams.get("utm_campaign"), 120),
  };
}

export function captureContactAttribution(): ContactAttribution | undefined {
  if (typeof window === "undefined") return;
  if (current) return current;
  try {
    const stored = JSON.parse(sessionStorage.getItem(key) ?? "null");
    if (stored?.createdAt > Date.now() - lifetime && stored.createdAt <= Date.now() &&
      stored.value && typeof stored.value.entry_path === "string" && stored.value.entry_path.startsWith("/") && !/[?#\u0000-\u001f\u007f]/.test(stored.value.entry_path) &&
      typeof stored.value.referrer_host === "string" && /^[a-z0-9.[\]:-]*$/i.test(stored.value.referrer_host) &&
      ["entry_path", "referrer_host", "utm_source", "utm_medium", "utm_campaign"].every(field => typeof stored.value[field] === "string" && stored.value[field].length <= (field.startsWith("utm_") ? 120 : 240))) {
      current = stored.value as ContactAttribution;
      return current;
    }
  } catch { /* Attribution must not block the contact when storage is disabled. */ }
  current = attributionFromEntry(window.location.href, document.referrer);
  try { sessionStorage.setItem(key, JSON.stringify({ createdAt: Date.now(), value: current })); }
  catch { /* No personal contact data is stored in this session preference. */ }
  return current;
}
