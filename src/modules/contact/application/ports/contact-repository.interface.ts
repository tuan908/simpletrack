import { Result } from "@/core/contracts/Result";
import type { ContactRow } from "@/infra/db/schema";
import {
    CreateContactPayload,
    CreateContactResultFailure,
    CreateContactResultSuccess,
} from "../../domain/Contact";

export interface IContactRepository {
  getContacts({
    page,
    pageSize,
  }: {
    page?: number;
    pageSize?: number;
  }): Promise<ContactRow[]>;
  createContact(
    contact: CreateContactPayload
  ): Promise<Result<CreateContactResultSuccess, CreateContactResultFailure[]>>;
}
