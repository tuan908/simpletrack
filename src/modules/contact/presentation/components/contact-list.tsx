"use client";

import { useContactsQuery } from "../hooks/useContactsQuery";
import { EmptyState } from "./empty-state";
import { UserListItem } from "./user-list-item";

export function ContactList() {
  const { contacts = [], isError } = useContactsQuery();

  if (isError) {
    return <div className="text-red-500">Failed to load contacts.</div>;
  }

  if (contacts.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:grid-rows-3">
      {contacts.map(c => (
        <UserListItem
          key={c.id}
          name={c.name}
          company={c.company ?? ""}
          status={c.status}
        />
      ))}
    </div>
  );
}
