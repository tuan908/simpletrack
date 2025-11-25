import { useTRPC } from "@/api/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateContactNote() {
  const queryClient = useQueryClient();
  const trpc = useTRPC(); // Renamed utils to trpc for clarity and consistency

  const { mutateAsync: createNote, isPending } = useMutation(
    trpc.contact.createNote.mutationOptions({
      onMutate: () => {
        queryClient.cancelQueries({ queryKey: trpc.contact.list.queryKey() });
      },
      onSuccess: (_data) => {
        toast.success("Success", { description: "Note created successfully!" });
      },
      onError: (_error) => {
        toast.error("Failed", { description: "Failed to create note." });
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.contact.list.queryKey(),
        });
      },
    }),
  );

  return {
    createNote,
    loading: isPending,
  };
}
