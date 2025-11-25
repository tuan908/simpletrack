import { UpdateNotePayload } from "../../domain/Note";
import { INoteRepository } from "../ports/note-repository.interface";

export class UpdateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(note: UpdateNotePayload): Promise<void> {
    await this.noteRepository.updateNote(note);
  }
}
