import { Result } from "@/core/contracts/Result";
import { contactModule } from "@/modules/contact";
import z from "zod";
import { createContactInput, updateContactInput } from "../schemas/contact";
import { createTrpcRouter, publicProcedure } from "../trpc";

const getContactsInput = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export const contactsRouter = createTrpcRouter({
  list: publicProcedure
    .input(getContactsInput)
    .query(async ({ input }) => {
      const result = await contactModule.usecases.getContacts.execute({
        page: input?.page ?? 1,
        pageSize: input?.pageSize ?? 10,
      });
      if (!result.ok) return Result.fail([{ error: "Failed to get contacts" }]);
      return result;
    }),
  create: publicProcedure.input(createContactInput).mutation(async ({input}) => {
      const result = await contactModule.usecases.createContact.execute(input);
      if (!result.ok) return Result.fail([{ error: "Failed to create contact" }]);
      return result;
  }),
  update: publicProcedure.input(updateContactInput).mutation(async ({input}) => {
      const result = await contactModule.usecases.updateContact.execute(input);
      if (!result.ok) return Result.fail([{ error: "Failed to update contact" }]);
      return result;
  }),
});
