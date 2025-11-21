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

  getContacts: ({
    page = 1,
    pageSize = 200,
  }: {
    page?: number;
    pageSize?: number;
  }) => {
    return api.get<Result<Contact[]>>("/contacts", {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    });
  },
};
