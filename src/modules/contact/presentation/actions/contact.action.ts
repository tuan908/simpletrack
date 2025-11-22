"use server";

import { createAction } from "@/core/lib/server-actions/create-action";
import z from "zod";
import { ContactUseCase } from "../../application/usecases/contact.usecase";
import { contactRepo } from "../../infra/contact.repository";

const contactUseCase = new ContactUseCase(contactRepo);

export async function getContacts(params: { limit: number; offset: number }) {
  const getContactsAction = await createAction({
    name: "GetContacts",
    description: "Fetches a list of contacts with pagination",
    schema: z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }),
    requiresAuth: false,
    handler: async (input) => {
      // In real implementation, use input.limit and input.offset to fetch paginated data
      const apiResponse = await contactUseCase.getContacts({
        pageSize: input.limit,
        page: input.offset,
      });
      if (!apiResponse.ok) {
        return [];
      }

      return apiResponse.value;
    },
  });
  const result = await getContactsAction(params);

  if (!result.success) {
    return { success: false, data: [] };
  }
  return { success: true, data: result.data };
}
