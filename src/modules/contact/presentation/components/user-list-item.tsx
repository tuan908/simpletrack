import { Contact, ContactStatus } from "../../domain/Contact";

interface UserListItemProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
}

/**
 * UserListItem Component
 * Displays a single user row/card based on screen size.
 */
export function UserListItem(props: UserListItemProps) {
  const { contact, onEdit } = props;
  // Determine badge color based on status for better UI
  const isActive = contact.status === ContactStatus.New;
  const badgeBaseClass = "px-3 py-1 rounded-full text-xs font-medium border";
  const badgeColorClass = isActive
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <div
      className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between transition-all hover:shadow-md"
      onClick={() => onEdit(contact)}
    >
      {/* Left Side: Name and Company */}
      <div className="flex flex-col">
        <span className="text-lg font-bold text-gray-900 leading-tight">
          {contact.name}
        </span>
        <span className="text-sm text-gray-500 mt-1">{contact.company}</span>
      </div>

      {/* Right Side (Desktop) / Bottom (Mobile): Status Badge */}
      <div className="flex md:justify-end">
        <span className={`${badgeBaseClass} ${badgeColorClass}`}>
          {ContactStatus[contact.status]}
        </span>
      </div>
    </div>
  );
}
