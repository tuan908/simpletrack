"use client";

import { contactApi } from "@/modules/contact/infra/contact.api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { EmptyState } from "./empty-state";
import { UserListItem } from "./user-list-item";

export function ContactList() {
  const { data: contactsResponse, isLoading, isError } = useSuspenseQuery({
    queryKey: ["contacts"],
    queryFn: () => {
      return contactApi.getContacts({ pageSize: 200, page: 1 });
    },
  });

  if (isError || contactsResponse.ok === false) {
    return <div className="text-red-500">Failed to load contacts.</div>;
  }

  if (contactsResponse?.value?.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:grid-rows-3">
      {contactsResponse?.value?.map(c => (
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
