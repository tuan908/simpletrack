import { PaginatedParams } from "@/core/contracts/Paginated";
import { Result } from "@/core/contracts/Result";
import type { ContactRow } from "@/infra/db/schema";
import {
  CreateContactPayload,
  CreateContactResultSuccess,
} from "../../domain/Contact";

export interface IContactRepository {
  getContacts({
    page,
    pageSize,
    search,
  }: PaginatedParams): Promise<ContactRow[]>;

  createContact(
    contact: CreateContactPayload,
  ): Promise<Result<CreateContactResultSuccess>>;

  updateContact(
    contact: CreateContactPayload & { id: string },
  ): Promise<Result<CreateContactResultSuccess>>;

  deleteContact(id: string): Promise<Result<boolean>>;
}
