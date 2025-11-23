import { ErrorCode } from "@/core/contracts/ErrorCodes";
import { PaginatedParams } from "@/core/contracts/Paginated";
import { Result } from "@/core/contracts/Result";
import { contact, db, eq, isNull } from "@/infra/db/client";
import { desc } from "drizzle-orm";
import { v7 } from "uuid";
import { IContactRepository } from "../application/ports/contact-repository.interface";
import { ContactStatus, CreateContactPayload } from "../domain/Contact";

export const contactRepo: IContactRepository = {
  async getContacts({ page = 1, pageSize = 10 }: PaginatedParams) {
    const offset = (page - 1) * pageSize;
    return db
      .select()
      .from(contact)
      .where(isNull(contact.deletedAt))
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
        return Result.failWith(
          "Name is required",
          "name",
          ErrorCode.VALIDATION_ERROR,
        );
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

      const [row] = await db
        .insert(contact)
        .values(newRow)
        .returning({ id: contact.id });

      return Result.ok({ id: row.id });
    } catch (err: any) {
      console.error("POST /api/v1/contacts error", err);
      return Result.failWith(
        String(err?.message ?? err),
        undefined,
        ErrorCode.DATABASE_ERROR,
      );
    }
  },

  async updateContact(contactPayload: CreateContactPayload & { id: string }) {
    try {
      const [row] = await db
        .update(contact)
        .set({
          name: String(contactPayload?.name).trim(),
          email: contactPayload?.email ?? null,
          phone: contactPayload?.phone ?? null,
          company: contactPayload?.company ?? null,
          status:
            typeof contactPayload?.status === "number"
              ? contactPayload?.status
              : ContactStatus.New,
          updatedAt: new Date(),
        })
        .where(eq(contact.id, contactPayload.id))
        .returning({ id: contact.id });

      return Result.ok({ id: row.id });
    } catch (err: any) {
      console.error("POST /api/v1/contacts error", err);
      return Result.failWith(
        String(err?.message ?? err),
        undefined,
        ErrorCode.DATABASE_ERROR,
      );
    }
  },

  async deleteContact(id: string) {
    try {
      const result = await db
        .update(contact)
        .set({ deletedAt: new Date() })
        .where(eq(contact.id, id))
        .returning({ id: contact.id });

      // Drizzle's update with .returning() returns an array of affected rows.
      if (result.length === 0) {
        return Result.failWith("Contact not found", "id", ErrorCode.NOT_FOUND);
      }

      return Result.ok(true);
    } catch (err: any) {
      console.error("DELETE /api/v1/contacts error", err);
      return Result.failWith(
        String(err?.message ?? err),
        undefined,
        ErrorCode.DATABASE_ERROR,
      );
    }
  },
};
