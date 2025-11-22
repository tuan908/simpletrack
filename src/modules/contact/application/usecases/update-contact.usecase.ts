import { Result } from "@/core/contracts/Result";
import { CreateContactPayload } from "../../domain/Contact";
import type { IContactRepository } from "../ports/contact-repository.interface";

export class UpdateContactUseCase {
  constructor(private repo: IContactRepository) {}

  async execute(contact: CreateContactPayload & { id: string }) {
    try {
      if (
        !contact?.name ||
        typeof contact?.name !== "string" ||
        !contact?.name.trim()
      ) {
        return Result.fail([{ error: "Name is required" }]);
      }

      const result = await this.repo.updateContact(contact);

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
