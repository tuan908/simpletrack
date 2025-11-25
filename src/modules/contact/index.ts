import { CreateContactUseCase } from "./application/usecases/create-contact.usecase";
import { CreateNoteUseCase } from "./application/usecases/create-note.usecase";
import { DeleteContactUseCase } from "./application/usecases/delete-contact.usecase";
import { GetContactsUseCase } from "./application/usecases/get-contacts.usecase";
import { UpdateContactUseCase } from "./application/usecases/update-contact.usecase";
import { UpdateNoteUseCase } from "./application/usecases/update-note.usecase";
import { contactRepo } from "./infra/contact.repository";
import { noteRepo } from "./infra/note.repository";

export const contactModule = {
  usecases: {
    list: new GetContactsUseCase(contactRepo),
    create: new CreateContactUseCase(contactRepo),
    update: new UpdateContactUseCase(contactRepo),
    delete: new DeleteContactUseCase(contactRepo),
    createNote: new CreateNoteUseCase(noteRepo),
    updateNote: new UpdateNoteUseCase(noteRepo),
  },
};
