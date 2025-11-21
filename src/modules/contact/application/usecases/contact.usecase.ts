import { PaginatedParams } from "@/core/contracts/Paginated";
import { Result } from "@/core/contracts/Result";
import { v7 } from "uuid";
import { CreateContactPayload } from "../../domain/Contact";
import { mapContactRowToDomain } from "../../infra/contact.mapper";
import type { IContactRepository } from "../ports/contact-repository.interface";

export class ContactUseCase {
  constructor(private repo: IContactRepository) {}

  async getContacts({ pageSize = 10, page = 1 }: PaginatedParams) {
    const contacts = await this.repo.getContacts({ page, pageSize });
    return Result.ok(contacts.map(contact => mapContactRowToDomain(contact)));
  }

  async createContact(contact: CreateContactPayload) {
    try {
      if (
        !contact?.name ||
        typeof contact?.name !== "string" ||
        !contact?.name.trim()
      ) {
        return Result.fail([{ error: "Name is required" }]);
      }

      const newRow = {
        id: v7(),
        name: String(contact?.name).trim(),
        email: contact?.name ?? null,
        phone: contact?.name ?? null,
        company: contact?.name ?? null,
        status: typeof contact?.name === "number" ? contact?.name : 0,
      };

      const result = await this.repo.createContact(newRow);

      if (!result.ok) {
        return Result.fail({ error: "Failed to create contact" });
      }

      return Result.ok({ id: result?.value.id });
    } catch (err: any) {
      console.error("POST /api/v1/contacts error", err);
      return Result.fail([{ error: String(err?.message ?? err) }]);
    }
  }
}
