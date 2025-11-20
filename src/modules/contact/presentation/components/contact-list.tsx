import { getContacts } from "../actions/contact.action";
import { EmptyState } from "./empty-state";
import { UserListItem } from "./user-list-item";

export async function ContactList() {
  const contactsResponse = await getContacts({ limit: 100, offset: 0 });

  if (!contactsResponse.success) {
    return <div className="text-red-500">Failed to load contacts.</div>;
  }

  if (contactsResponse.data.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="flex flex-col gap-3">
      {contactsResponse.data.map(c => (
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
