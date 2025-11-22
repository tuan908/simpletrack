"use client";

import { useTRPC } from "@/api/trpc/client";
import {
  CreateContactForm,
  createContactInput,
} from "@/api/trpc/schemas/contact";
import { SubmitButton } from "@/core/components/submit-button";
import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ContactStatus } from "../../domain/Contact";
import { statusOptions } from "../../infra/contact.constant";

export function CreateContactModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { mutateAsync: createContact, isPending: loading } = useMutation(
    trpc.contact.create.mutationOptions({
      onError: (err, _newContact, _context) => {
        console.error("create contact failed", err);
        toast.error("Failed", {
          description:
            err instanceof Error ? err.message : "Failed to create contact.",
        });
      },
      onSuccess: (data, _variables) => {
        toast.success("Success", {
          description: "Contact created successfully.",
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

  const {
    register,
    handleSubmit,
    control,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<CreateContactForm>({
    resolver: zodResolver(createContactInput),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      status: ContactStatus.New,
    },
  });

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setFocus("name"));
    }
  }, [open, setFocus]);
  console.log(errors);

  async function onSubmit(values: CreateContactForm) {
    try {
      await createContact(values);
      setOpen(false);
      reset(); // Reset form after successful submission
    } catch (err) {
      // Error is already handled in onError
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          New Contact
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Contact</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col gap-3"
        >
          <div>
            <Label htmlFor="name" className="flex gap-x-2">
              <span>Name</span> <span className="text-red-500">*</span>
            </Label>
            <Input {...register("name")} placeholder="Full name" />
            {errors.name && (
              <p className="text-destructive text-sm">
                {String(errors.name.message)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input {...register("company")} placeholder="Company (optional)" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} placeholder="email@example.com" />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {String(errors.email.message)}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input {...register("phone")} placeholder="Phone (optional)" />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  onValueChange={(v) =>
                    field.onChange(Number(v) as ContactStatus)
                  }
                  value={String(field.value)}
                >
                  <SelectTrigger aria-label="Status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <SubmitButton
              submitting={loading}
              label="Create"
              loadingLabel="Saving..."
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
