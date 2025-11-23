import { CreateContactUseCase } from "./application/usecases/create-contact.usecase";
import { DeleteContactUseCase } from "./application/usecases/delete-contact.usecase";
import { GetContactsUseCase } from "./application/usecases/get-contacts.usecase";
import { UpdateContactUseCase } from "./application/usecases/update-contact.usecase";
import { contactRepo } from "./infra/contact.repository";

export const contactModule = {
  usecases: {
    list: new GetContactsUseCase(contactRepo),
    create: new CreateContactUseCase(contactRepo),
    update: new UpdateContactUseCase(contactRepo),
    delete: new DeleteContactUseCase(contactRepo),
  },
};
