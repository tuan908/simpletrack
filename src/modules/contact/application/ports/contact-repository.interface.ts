import type { ContactRow } from "@/infra/db/schema";

export interface IContactRepository {
    getContacts(): Promise<ContactRow[]>;
}