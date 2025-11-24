"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/core/components/ui/alert-dialog";
import { startTransition } from "react";
import { Contact } from "../../domain/Contact";
import { useDeleteContact } from "../hooks/useDeleteContact";

interface DeleteContactModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  contact: Contact;
}

export function DeleteContactModal({
  contact,
  open,
  onClose,
}: DeleteContactModalProps) {
  const { deleteContact, loading } = useDeleteContact();

  async function handleDelete() {
    try {
      startTransition(() => {
        deleteContact({ id: contact?.id });
      });
      onClose(true);
    } catch (error) {}
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => onClose(open)}>
      <AlertDialogContent>
        <AlertDialogTitle>Delete {contact.name}?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete this contact and all associated notes and
          reminders.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
