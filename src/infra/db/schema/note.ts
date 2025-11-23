import { pgEnum, text, varchar } from "drizzle-orm/pg-core";
import { pgTableWithAudit } from "../base/helper";
import { contact } from "./contact";

export const noteTypeEnum = pgEnum("note_type", [
  "Call",
  "Email",
  "Meeting",
  "Note",
]);

export const note = pgTableWithAudit("note", {
  id: varchar("id", { length: 255 }).primaryKey(),
  content: text("content").notNull(),
  type: noteTypeEnum("type").notNull(),
  contactId: varchar("contact_id", { length: 255 })
    .notNull()
    .references(() => contact.id, { onDelete: "cascade" }),
});

export type NoteRow = typeof note.$inferSelect;
export type NewNoteRow = typeof note.$inferInsert;
