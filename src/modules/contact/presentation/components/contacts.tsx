"use client";

import { useContactModal } from "../hooks/useContactModal";
import { useContacts } from "../hooks/useContacts";
import { EmptyState } from "./empty-state";
import { UpdateContactModal } from "./update-contact-modal";
import { UserListItem } from "./user-list-item";

interface ContactsProps {
  activeSearch: string;
}

export function Contacts({ activeSearch }: ContactsProps) {
  const { open, contact, openModal, closeModal } = useContactModal();

  const {
    contacts = [],
    isError,
    isLoading,
  } = useContacts({ search: activeSearch });

  if (isError) {
    return <div className="text-red-500">Failed to load contacts.</div>;
  }

  // No longer show skeleton here, handled by Suspense in page.tsx
  if (isLoading && !activeSearch) {
    return null; // Or a minimal loading indicator if necessary, but Suspense fallback handles it visually
  }

  const isEmpty = !isLoading && contacts.length === 0 && activeSearch;
  const hasResults = !isLoading && contacts.length > 0;

  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:grid-rows-3">
      {contacts.length === 0 && !activeSearch && <EmptyState />}

      {isEmpty && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            No contacts found for "{activeSearch}"
          </p>
        </div>
      )}

      {hasResults &&
        contacts.map((c) => (
          <UserListItem key={c.id} contact={c} onEdit={() => openModal(c)} />
        ))}

      <UpdateContactModal open={open} onClose={closeModal} contact={contact} />
    </div>
  );
}
