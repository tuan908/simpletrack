import { contact, ContactStatus } from "@/infra/db/schema";
import { Contact } from "../domain/Contact";

export function mapContactRowToDomain(row: typeof contact.$inferSelect): Contact {
    return {
        id: row.id,
        name: row.name,
        email: row.email || '',
        phone: row.phone || '',
        company: row.company || '',
        status: ContactStatus[row.status],
    };
}