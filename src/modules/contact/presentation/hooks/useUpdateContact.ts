import { useTRPC } from "@/api/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateContact() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { mutateAsync: updateContact, isPending: loading } = useMutation(
    trpc.contact.update.mutationOptions({
      onError: (err, _newContact, _context) => {
        console.error("create contact failed", err);
        toast.error("Failed", {
          description:
            err instanceof Error ? err.message : "Failed to create contact.",
        });
      },
      onSuccess: (data, _variables) => {
        toast.success("Success", {
          description: "Contact updated successfully.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success to ensure sync
        queryClient.invalidateQueries({
          queryKey: trpc.contact.list.queryKey(),
        });
      },
    }),
  );

  return { loading, updateContact };
}
