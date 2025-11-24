// hooks/useContactModal.ts
import { useState } from "react";
import { ContactStatus } from "../../domain/Contact";

export function useContactModal() {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState({
    id: "",
    name: "",
    status: ContactStatus.New,
  });

  const openModal = (contactData: typeof contact) => {
    setContact(contactData);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return {
    open,
    contact,
    openModal,
    closeModal,
  };
}
