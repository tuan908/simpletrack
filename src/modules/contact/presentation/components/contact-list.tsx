"use client";

import { useState } from "react";
import { ContactStatus } from "../../domain/Contact";
import { useContactsQuery } from "../hooks/useContactsQuery";
import { EmptyState } from "./empty-state";
import { UpdateContactModal } from "./update-contact-modal";
import { UserListItem } from "./user-list-item";

export function ContactList() {
  const { contacts = [], isError } = useContactsQuery();
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState(() => ({
    id: "",
    name: "",
    status: ContactStatus.New,
  }));

  if (isError) {
    return <div className="text-red-500">Failed to load contacts.</div>;
  }

  if (contacts.length === 0) {
    return <EmptyState />;
  }
  return (
    <>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:grid-rows-3">
        {contacts.map(c => (
          <UserListItem
            key={c.id}
            contact={c}
            onEdit={() => {
              setContact(c);
              setOpen(true);
            }}
          />
        ))}
      </div>
      <UpdateContactModal
        open={open}
        onClose={() => setOpen(false)}
        contact={contact}
      />
    </>
  );
}
