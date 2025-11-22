import { ContactList } from "@/modules/contact/presentation/components/contact-list";
import { ContactListSkeleton } from "@/modules/contact/presentation/components/contact-list-skeleton";
import { CreateContactModal } from "@/modules/contact/presentation/components/create-contact-modal";
import { Suspense } from "react";

/**
 * Home / Dashboard
 * Fetches contacts from the database server-side and renders list or empty state.
 */
export default function Dashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col gap-4 mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">Contacts</h2>
        <CreateContactModal />
      </div>

      <Suspense fallback={<ContactListSkeleton count={20} />}>
        <ContactList />
      </Suspense>
    </div>
  );
}
