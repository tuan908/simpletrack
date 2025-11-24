"use client";

import { useDebounce } from "@/core/lib/hooks/useDebounce";
import { useState } from "react";
import { useContactModal } from "../hooks/useContactModal";
import { useContactsQuery } from "../hooks/useContactsQuery";
import { ContactListSkeleton } from "./contact-list-skeleton";
import { ContactSearchInput } from "./contact-search-input";
import { EmptyState } from "./empty-state";
import { UpdateContactModal } from "./update-contact-modal";
import { UserListItem } from "./user-list-item";

export function ContactList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500); // 500ms debounce
  const activeSearch = committedSearch || debouncedSearch;

  const { open, contact, openModal, closeModal } = useContactModal();

  const {
    contacts = [],
    isError,
    isLoading,
  } = useContactsQuery({ search: activeSearch });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Clear committed search when user types
    if (committedSearch) {
      setCommittedSearch("");
    }
  };

  const handleSearch = (value: string) => {
    // Immediate search on Enter
    setCommittedSearch(value);
  };

  if (isError) {
    return <div className="text-red-500">Failed to load contacts.</div>;
  }

  const isEmpty = !isLoading && contacts.length === 0 && debouncedSearch;
  const hasResults = !isLoading && contacts.length > 0;

  return (
    <>
      <div className="space-y-4">
        <ContactSearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          placeholder="Search by name, company, email, or phone..."
        />
      </div>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:grid-rows-3">
        {contacts.length === 0 && !activeSearch && <EmptyState />}
        {/* Loading State */}
        {isLoading && <ContactListSkeleton count={10} />}

        {/* Empty State - No Results */}
        {isEmpty && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              No contacts found for "{debouncedSearch}"
            </p>
          </div>
        )}
        {hasResults &&
          contacts.map(c => (
            <UserListItem key={c.id} contact={c} onEdit={() => openModal(c)} />
          ))}
      </div>
      <UpdateContactModal open={open} onClose={closeModal} contact={contact} />
    </>
  );
}
