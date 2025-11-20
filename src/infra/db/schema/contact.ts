import { integer, varchar } from "drizzle-orm/pg-core";
import { pgTableWithAudit } from "../base/helper";

export enum ContactStatus {
  New,
  Talking,
  Won,
  Lost,
}

export const contact = pgTableWithAudit("contact", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  status: integer("status").notNull().default(ContactStatus.New),
});

export type ContactRow = typeof contact.$inferSelect;
export type NewContactRow = typeof contact.$inferInsert;
