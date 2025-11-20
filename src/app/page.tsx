import { ContactStatus } from "@/infra/db/client";
import { getContacts } from "@/modules/contact/presentation/actions/contact.action";
import { EmptyState } from "@/modules/contact/presentation/components/empty-state";
import { UserListItem } from "@/modules/contact/presentation/components/user-list-item";

/**
 * Home / Dashboard
 * Fetches contacts from the database server-side and renders list or empty state.
 */
export default async function Dashboard() {
  // Server-side fetch of contacts using drizzle client
  let contacts = await getContacts();

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col gap-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Contacts</h2>

      {contacts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {contacts.map((c: any) => (
            <UserListItem
              key={c.id}
              name={c.name}
              company={c.company ?? ""}
              status={String(ContactStatus[c.status] ?? "Unknown")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
