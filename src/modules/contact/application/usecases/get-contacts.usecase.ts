import { PaginatedParams } from "@/core/contracts/Paginated";
import { Result } from "@/core/contracts/Result";
import { mapContactRowToDomain } from "../../infra/contact.mapper";
import type { IContactRepository } from "../ports/contact-repository.interface";

export class GetContactsUseCase {
  constructor(private repo: IContactRepository) {}

  async execute({ pageSize = 10, page = 1, search }: PaginatedParams) {
    const contacts = await this.repo.getContacts({ page, pageSize, search, });
    return Result.ok(contacts.map((contact) => mapContactRowToDomain(contact)));
  }
}
