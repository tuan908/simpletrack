import type { ContactNoteType } from "@/infra/db/schema";

export interface Note {
  id: string;
  content: string;
  type: ContactNoteType;
  contactId: string;
}

export interface CreateNotePayload {
  content: string;
  type: ContactNoteType;
  contactId: string;
}

export interface UpdateNotePayload {
  id: string;
  content: string;
  type: ContactNoteType;
  contactId: string;
}
