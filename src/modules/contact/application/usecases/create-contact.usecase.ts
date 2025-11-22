import { Result } from "@/core/contracts/Result";
import { v7 } from "uuid";
import { ContactStatus, CreateContactPayload } from "../../domain/Contact";
import type { IContactRepository } from "../ports/contact-repository.interface";

export class CreateContactUseCase {
  constructor(private repo: IContactRepository) {}

  async execute(contact: CreateContactPayload) {
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
        email: contact?.email ?? null,
        phone: contact?.phone ?? null,
        company: contact?.company ?? null,
        status:
          typeof contact?.status === "number"
            ? contact?.status
            : ContactStatus.New,
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
