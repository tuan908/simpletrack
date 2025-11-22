import { PaginatedParams } from "@/core/contracts/Paginated";
import { Result } from "@/core/contracts/Result";
import type { ContactRow } from "@/infra/db/schema";
import {
  CreateContactPayload,
  CreateContactResultFailure,
  CreateContactResultSuccess,
} from "../../domain/Contact";

export interface IContactRepository {
  getContacts({ page, pageSize }: PaginatedParams): Promise<ContactRow[]>;

  createContact(
    contact: CreateContactPayload,
  ): Promise<Result<CreateContactResultSuccess, CreateContactResultFailure[]>>;

  updateContact(
    contact: CreateContactPayload & { id: string },
  ): Promise<Result<CreateContactResultSuccess, CreateContactResultFailure[]>>;
}
