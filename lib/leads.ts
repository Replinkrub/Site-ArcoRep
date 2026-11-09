import { z } from "zod";
import { attendanceSubjects } from "./attendance";
import { catalogBrands } from "./catalog-data";
import { segments, states } from "./form-options";

const shortText = (min: number, max: number) => z.string().trim().min(min).max(max);
const common = {
  id: z.string().uuid(), name: shortText(2, 80),
  phone: z.string().trim().max(22).transform(value => value.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "")).pipe(z.string().regex(/^\d{10,11}$/)),
  company: shortText(2, 120), city: shortText(2, 80), state: z.enum(states), segment: z.enum(segments),
  website: z.string().max(0).optional(),
  attribution: z.object({
    entry_path: z.string().trim().max(240).refine(value => value.startsWith("/") && !/[?#\u0000-\u001f\u007f]/.test(value)),
    referrer_host: z.string().trim().max(240).regex(/^[a-z0-9.[\]:-]*$/i),
    utm_source: z.string().trim().max(120), utm_medium: z.string().trim().max(120), utm_campaign: z.string().trim().max(120),
  }).optional(),
};
const brand = z.string().refine(value => catalogBrands.some(item => item.slug === value));
export const leadSchema = z.discriminatedUnion("source", [
  z.object({ ...common, source: z.literal("catalog"), brand, demand: z.string().trim().max(1200).default("") }),
  z.object({ ...common, source: z.literal("attendance"), brand: z.union([z.literal(""), brand]),
    subject: z.string().refine(value => Object.hasOwn(attendanceSubjects, value)), demand: shortText(10, 1200),
    cnpj: z.string().trim().max(18).transform(value => value.replace(/[.\-/\s]/g, "").toUpperCase()).pipe(z.string().regex(/^[A-Z0-9]{12}\d{2}$/)),
  }),
]);
export type LeadSubmission = z.infer<typeof leadSchema>;
export type SavedLead = {
  id: string; source: "catalog" | "attendance"; name: string; phone: string;
  company: string; city: string; state: string; segment: string; brand: string;
  subject: string; demand: string; cnpj: string | null; created_at: string;
  entry_path: string | null; referrer_host: string | null;
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null;
};
export function csvCell(value: string | null) {
  const text = value ?? "";
  const safe = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}
