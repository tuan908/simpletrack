import { ErrorCode } from "@/core/contracts/ErrorCodes";
import { Result } from "@/core/contracts/Result";
import { contactModule } from "@/modules/contact";
import z from "zod";
import {
  createContactInput,
  deleteContactInput,
  updateContactInput,
} from "../schemas/contact";
import { createTrpcRouter, publicProcedure } from "../trpc";

const getContactsInput = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
});

export const contactsRouter = createTrpcRouter({
  list: publicProcedure.input(getContactsInput).query(async ({ input }) => {
    const result = await contactModule.usecases.list.execute({
      page: input?.page ?? 1,
      pageSize: input?.pageSize ?? 10,
      search: input?.search,
    });
    if (!result.ok)
      return Result.failWith(
        "Failed to get contacts",
        undefined,
        ErrorCode.INTERNAL_ERROR,
      );
    return result;
  }),
  create: publicProcedure
    .input(createContactInput)
    .mutation(async ({ input }) => {
      const result = await contactModule.usecases.create.execute(input);
      if (!result.ok)
        return Result.failWith(
          "Failed to create contact",
          undefined,
          ErrorCode.INTERNAL_ERROR,
        );
      return result;
    }),
  update: publicProcedure
    .input(updateContactInput)
    .mutation(async ({ input }) => {
      const result = await contactModule.usecases.update.execute(input);
      if (!result.ok)
        return Result.failWith(
          "Failed to update contact",
          undefined,
          ErrorCode.INTERNAL_ERROR,
        );
      return result;
    }),
  delete: publicProcedure
    .input(deleteContactInput)
    .mutation(async ({ input }) => {
      const result = await contactModule.usecases.delete.execute(input);
      if (!result.ok)
        return Result.failWith(
          "Failed to delete contact",
          undefined,
          ErrorCode.INTERNAL_ERROR,
        );
      return result;
    }),
});
