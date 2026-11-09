import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  source: text("source").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  company: text("company").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  segment: text("segment").notNull(),
  brand: text("brand").notNull().default(""),
  subject: text("subject").notNull(),
  demand: text("demand").notNull().default(""),
  cnpj: text("cnpj"),
  createdAt: text("created_at").notNull(),
  requestHash: text("request_hash").notNull(),
  ipHash: text("ip_hash").notNull().default(""),
  entryPath: text("entry_path"),
  referrerHost: text("referrer_host"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
}, (table) => [
  index("idx_leads_created_id").on(table.createdAt, table.id),
  index("idx_leads_ip_created").on(table.ipHash, table.createdAt),
]);
