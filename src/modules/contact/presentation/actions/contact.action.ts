"use server"
import { ContactUseCase } from "../../application/usecases/contact.usecase";
import { contactRepo } from "../../infra/contact.repository";

 const contactUseCase = new ContactUseCase(contactRepo);

export async function getContacts() {
    const contacts = await contactUseCase.execute();
    if (!contacts.ok) {
        throw new Error(contacts.errors);
    }

    return contacts.value;
}