import { db, eq, not, contactNote } from "@/infra/db/client";
import { INoteRepository } from "../application/ports/note-repository.interface";
import { CreateNotePayload, Note, UpdateNotePayload } from "../domain/Note";
import { v7 } from "uuid";

export const noteRepo: INoteRepository = {
  async createNote(payload: CreateNotePayload): Promise<void> {
    const newNote = {
      id: v7(),
      ...payload,
    };
    db.insert(contactNote).values(newNote);
  },
  async updateNote(payload: UpdateNotePayload) {
    db.update(contactNote).set(payload).where(eq(contactNote.id, payload.id));
  },
  async deleteNote(id: string): Promise<void> {
    db.update(contactNote).set({ deletedAt: new Date() }).where(eq(contactNote.id, id));
  },
  async getNote(id: string): Promise<Note | null> {
    const [result] = await db
      .select()
      .from(contactNote)
      .where(eq(contactNote.id, id))
      .limit(1);
    return result;
  },
};
