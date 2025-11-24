import { useTRPC } from "@/api/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteContact() {
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

  return {
    deleteContact,
    loading: isPending,
  };
}
