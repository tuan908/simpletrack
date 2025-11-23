import { useTRPC } from "@/api/trpc/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/core/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startTransition } from "react";
import { toast } from "sonner";
import { Contact } from "../../domain/Contact";

interface DeleteContactModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  contact: Contact;
}

export default function DeleteContactModal({
  contact,
  open,
  onClose,
}: DeleteContactModalProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteContact, isPending } = useMutation(
    trpc.contact.delete.mutationOptions({
      onError(_error) {
        toast("Failed", { description: "Failed to delete contact" });
      },
      onSuccess(_data, _variables, _onMutateResult, _context) {
        toast("Success", { description: "Deleted contact successfully" });
      },
      onSettled() {
        queryClient.invalidateQueries({
          queryKey: trpc.contact.list.queryKey(),
        });
      },
    }),
  );

  async function handleDelete() {
    try {
      startTransition(() => {
        deleteContact({ id: contact?.id });
      });
      onClose(true);
    } catch (error) {
      toast("Error", { description: "Failed to delete contact" });
    }
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
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
