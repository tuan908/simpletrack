import { CreateNotePayload, Note, UpdateNotePayload } from "../../domain/Note";

export interface INoteRepository {
  createNote(note: CreateNotePayload): Promise<void>;
  updateNote(note: UpdateNotePayload): Promise<void>;
  deleteNote(id: string): Promise<void>;
  getNote(id: string): Promise<Note | null>;
}
