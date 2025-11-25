import { pgEnum, text, varchar } from "drizzle-orm/pg-core";
import { pgTableWithAudit } from "../base/helper";
import { contact } from "./contact";

export const contactNoteTypeEnum = pgEnum("contact_note_type", [
  "Call",
  "Email",
  "Meeting",
  "Note",
]);

export type ContactNoteType = (typeof contactNoteTypeEnum.enumValues)[number];

export const contactNote = pgTableWithAudit("contact_note", {
  id: varchar("id", { length: 255 }).primaryKey(),
  content: text("content").notNull(),
  type: contactNoteTypeEnum("type").notNull(),
  contactId: varchar("contact_id", { length: 255 })
    .notNull()
    .references(() => contact.id, { onDelete: "cascade" }),
});

export type ContactNoteRow = typeof contactNote.$inferSelect;
export type NewContactNoteRow = typeof contactNote.$inferInsert;
