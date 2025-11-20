import { contact, db } from "@/infra/db/client";
import { IContactRepository } from "../application/ports/contact-repository.interface";

export const contactRepo: IContactRepository = {
    async getContacts() {
        return db.select().from(contact);
    }
}