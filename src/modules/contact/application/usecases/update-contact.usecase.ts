import { updateContactInput } from "@/api/trpc/schemas/contact";
import { ErrorCode } from "@/core/contracts/ErrorCodes";
import { Result } from "@/core/contracts/Result";
import { ZodError } from "zod";
import { CreateContactPayload } from "../../domain/Contact";
import type { IContactRepository } from "../ports/contact-repository.interface";

export class UpdateContactUseCase {
  constructor(private repo: IContactRepository) {}

  async execute(contact: CreateContactPayload & { id: string }) {
    try {
      const validatedContact = updateContactInput.parse(contact);

      const result = await this.repo.updateContact(validatedContact);

      if (!result.ok) {
        // Assuming the repository returns a ResultFailure with errors array,
        // and we want to propagate the first error or a generic one.
        // For simplicity, let's use a generic error here as the actual error detail
        // from result.errors would need more context to map properly.
        return Result.failWith(
          "Failed to update contact",
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
