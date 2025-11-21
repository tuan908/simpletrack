import { PaginatedParams } from "@/core/contracts/Paginated";
import { Result } from "@/core/contracts/Result";
import { api } from "@/core/lib/api/client";
import {
  Contact,
  CreateContactPayload,
  CreateContactResultFailure,
  CreateContactResultSuccess,
} from "../domain/Contact";

export const contactApi = {
  createContact: (payload: CreateContactPayload) => {
    return api.post<
      Result<CreateContactResultSuccess, CreateContactResultFailure[]>
    >("/contacts", payload);
  },

  getContacts: ({ page = 1, pageSize = 10 }: PaginatedParams) => {
    return api.get<Result<Contact[]>>("/contacts", {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    });
  },

  getContactById: (id: string) => {
    return api.get<Result<Contact>>(`/contacts/${id}`);
  },
};
