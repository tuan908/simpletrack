import { CreateContactUseCase } from "./application/usecases/create-contact.usecase";
import { GetContactsUseCase } from "./application/usecases/get-contacts.usecase";
import { UpdateContactUseCase } from "./application/usecases/update-contact.usecase";
import { contactRepo } from "./infra/contact.repository";

export const contactModule = {
  usecases: {
    getContacts: new GetContactsUseCase(contactRepo),
    createContact: new CreateContactUseCase(contactRepo),
    updateContact: new UpdateContactUseCase(contactRepo),
  },
};
