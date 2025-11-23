import { createContactInput } from "@/api/trpc/schemas/contact";
import { ErrorCode } from "@/core/contracts/ErrorCodes";
import { Result } from "@/core/contracts/Result";
import { v7 } from "uuid";
import { ZodError } from "zod";
import { ContactStatus, CreateContactPayload } from "../../domain/Contact";
import type { IContactRepository } from "../ports/contact-repository.interface";

export class CreateContactUseCase {
  constructor(private repo: IContactRepository) {}

  async execute(contact: CreateContactPayload) {
    try {
      const validatedContact = createContactInput.parse(contact);

      const newRow = {
        id: v7(),
        name: String(validatedContact.name).trim(),
        email: validatedContact.email ?? null,
        phone: validatedContact.phone ?? null,
        company: validatedContact.company ?? null,
        status: validatedContact.status ?? ContactStatus.New,
      };

      const result = await this.repo.createContact(newRow);

      if (!result.ok) {
        // Propagate the error from the repository if available, otherwise a generic one.
        return Result.failWith(
          "Failed to create contact",
          undefined,
          ErrorCode.INTERNAL_ERROR,
        );
      }

      return Result.ok({ id: result?.value.id });
    } catch (err: any) {
      if (err instanceof ZodError) {
        return Result.failWith(
          "Validation failed: " + err.message,
          undefined,
          ErrorCode.VALIDATION_ERROR,
        );
      }
      console.error("POST /api/v1/contacts error", err);
      return Result.failWith(
        String(err?.message ?? err),
        undefined,
        ErrorCode.INTERNAL_ERROR,
      );
    }
  }
}
