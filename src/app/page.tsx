"use client";

import { useDebounce } from "@/core/lib/hooks/useDebounce"; // Add useDebounce import
import { ContactSearchInput } from "@/modules/contact/presentation/components/contact-search-input"; // Renamed from contact-search-input.tsx
import { Contacts } from "@/modules/contact/presentation/components/contacts";
import { ContactsSkeleton } from "@/modules/contact/presentation/components/contacts-skeleton";
import { CreateContactModal } from "@/modules/contact/presentation/components/create-contact-modal";
import { Suspense, useState } from "react";

/**
 * Home / Dashboard
 * Fetches contacts from the database server-side and renders list or empty state.
 */
export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500); // 500ms debounce
  const activeSearch = committedSearch || debouncedSearch;

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

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col gap-4 mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">Contacts</h2>
        <CreateContactModal />
      </div>

      <div className="space-y-4">
        <ContactSearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          placeholder="Search by name, company, email, or phone..."
        />
      </div>

      <Suspense fallback={<ContactsSkeleton count={10} />}>
        <Contacts activeSearch={activeSearch} />
      </Suspense>
    </div>
  );
}
