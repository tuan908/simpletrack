import { Result } from "@/core/contracts/Result";
import type { IContactRepository } from "../ports/contact-repository.interface";

export class ContactUseCase {
  constructor(private repo: IContactRepository) {}

  async execute() {
    // const contacts = await this.repo.getContacts();
    const contacts = [
      {
        id: "d3e2f3f0-1a2b-4c3d-9e4f-111111111111",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        phone: "+1 (555) 123-4567",
        company: "Blue Pine Co.",
        status: 0, // New
      },
      {
        id: "a5b6c7d8-2222-3333-4444-222222222222",
        name: "Bob Martinez",
        email: "bob.martinez@example.com",
        phone: "+1 (555) 987-6543",
        company: "Acme Widgets",
        status: 1, // Talking
      },
      {
        id: "c9d8e7f6-3333-4444-5555-333333333333",
        name: "Chloe Zhang",
        email: "chloe.zhang@example.com",
        phone: null,
        company: "Orbit Labs",
        status: 2, // Won
      },
      {
        id: "f1e2d3c4-4444-5555-6666-444444444444",
        name: "Daniel Kim",
        email: null,
        phone: "+44 20 7946 0958",
        company: "North Star",
        status: 3, // Lost
      },
      {
        id: "b7a6c5d4-5555-6666-7777-555555555555",
        name: "Elena Petrova",
        email: "elena.petrova@example.com",
        phone: "+7 495 123-4567",
        company: "Moscow Tech",
        status: 0,
      },
    ];
    return Result.ok(contacts);
  }
}
