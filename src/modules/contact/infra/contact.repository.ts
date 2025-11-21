import { PaginatedParams } from "@/core/contracts/Paginated";
import { Result } from "@/core/contracts/Result";
import { contact, db } from "@/infra/db/client";
import { desc } from "drizzle-orm";
import { v7 } from "uuid";
import { IContactRepository } from "../application/ports/contact-repository.interface";
import { CreateContactPayload } from "../domain/Contact";

export const contactRepo: IContactRepository = {
  async getContacts({ page = 1, pageSize = 10 }: PaginatedParams) {
    const offset = (page - 1) * pageSize;
    return db
      .select()
      .from(contact)
      .limit(pageSize)
      .offset(offset)
      .orderBy(desc(contact.createdAt));
  },
  async createContact(contactPayload: CreateContactPayload) {
    try {
      if (
        !contactPayload?.name ||
        typeof contactPayload?.name !== "string" ||
        !contactPayload?.name.trim()
      ) {
        return Result.fail([{ error: "Name is required" }]);
      }

      const newRow = {
        id: v7(),
        name: String(contactPayload?.name).trim(),
        email: contactPayload?.email ?? null,
        phone: contactPayload?.phone ?? null,
        company: contactPayload?.company ?? null,
        status:
          typeof contactPayload?.status === "number"
            ? contactPayload?.status
            : 0,
      };

      // Insert via drizzle
      // @ts-ignore
      const [row] = await db
        .insert(contact)
        .values(newRow)
        .returning({ id: contact.id });

      return Result.ok({ id: row.id });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("POST /api/v1/contacts error", err);
      return Result.fail([{ error: String(err?.message ?? err) }]);
    }
  },
};
