import { deleteContactInput } from "@/api/trpc/schemas/contact";
import { ErrorCode } from "@/core/contracts/ErrorCodes";
import { Result } from "@/core/contracts/Result";
import { ZodError } from "zod";
import { IContactRepository } from "../ports/contact-repository.interface";

interface DeleteContactPayload {
  id: string;
}

export class DeleteContactUseCase {
  constructor(private repo: IContactRepository) {}

  async execute(payload: DeleteContactPayload) {
    try {
      const validatedPayload = deleteContactInput.parse(payload);
      const { id } = validatedPayload;

      const result = await this.repo.deleteContact(id);

      if (!result.ok) {
        // Propagate the error from the repository if available, otherwise a generic one.
        return Result.failWith(
          "Failed to delete contact",
          undefined,
          ErrorCode.INTERNAL_ERROR,
        );
      }

      return Result.ok(result.value);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return Result.failWith(
          "Validation failed: " + err.message,
          undefined,
          ErrorCode.VALIDATION_ERROR,
        );
      }
      console.error("DELETE /api/v1/contacts error", err);
      return Result.failWith(
        String(err?.message ?? err),
        undefined,
        ErrorCode.INTERNAL_ERROR,
      );
    }
  }
}
