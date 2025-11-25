import { CreateNotePayload } from "../../domain/Note";
import { INoteRepository } from "../ports/note-repository.interface";

export class CreateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(note: CreateNotePayload): Promise<void> {
    return await this.noteRepository.createNote(note);
  }
}
