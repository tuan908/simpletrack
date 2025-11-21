"use client";

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
import { Result } from "@/core/contracts/Result";
import { api } from "@/core/lib/api/client";
import { ContactStatus } from "@/infra/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine(v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Invalid email",
    }),
  phone: z.string().optional(),
  status: z.enum(ContactStatus)
});

type ContactForm = z.infer<typeof contactSchema>;

// Assuming your contact type looks like this
type Contact = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: number;
  createdAt?: string;
};

export function CreateContactModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: createContact, isPending: loading } = useMutation({
    mutationFn: async (data: ContactForm) => {
      const res = await api.post<
        Result<{ id: string }, Array<{ error: string }>>
      >("/contacts", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        status: data.status,
      });

      if (res.ok) {
        return { id: res.value.id };
      }

      throw new Error(res.errors?.[0]?.error || "Failed to create contact");
    },
    onMutate: async (newContact: ContactForm) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["contacts"] });

      // Snapshot previous value
      const apiResponse = queryClient.getQueryData<Result<Contact[]>>(["contacts"]);
      let previousContacts: Contact[] = [];

      if (apiResponse && apiResponse.ok) {
        previousContacts = apiResponse.value;
      }

      console.log("Previous contacts:", previousContacts);

      // Optimistically update to the new value
      if (previousContacts) {
        const optimisticContact: Contact = {
          id: `temp-${Date.now()}`, // Temporary ID
          name: newContact.name,
          company: newContact.company,
          email: newContact.email,
          phone: newContact.phone,
          status: newContact.status,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData<Contact[]>(
          ["contacts"],
          [optimisticContact, ...previousContacts]
        );
      }

      // Return context with snapshot
      return { previousContacts };
    },
    onError: (err, newContact, context) => {
      // Rollback on error
      if (context?.previousContacts) {
        queryClient.setQueryData(["contacts"], context.previousContacts);
      }

      console.error("create contact failed", err);
      toast.error("Failed", {
        description: err instanceof Error ? err.message : "Failed to create contact.",
      });
    },
    onSuccess: (data, variables) => {
      // Replace temporary contact with real one
      const previousContacts = queryClient.getQueryData<Contact[]>(["contacts"]);

      if (previousContacts) {
        const updatedContacts = previousContacts.map(contact => {
          // Replace the temp contact with the real one
          if (contact.id.startsWith("temp-")) {
            return {
              ...contact,
              id: data.id, // Real ID from server
            };
          }
          return contact;
        });

        queryClient.setQueryData(["contacts"], updatedContacts);
      }

      toast.success("Success", {
        description: "Contact created successfully.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      status: ContactStatus.New,
    },
  });

  useEffect(() => {
    if (open) setTimeout(() => setFocus("name"), 40);
  }, [open, setFocus]);

  async function onSubmit(values: ContactForm) {
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
            <Input id="name" {...register("name")} placeholder="Full name" />
            {errors.name && (
              <p className="text-destructive text-sm">
                {String(errors.name.message)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              {...register("company")}
              placeholder="Company (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="email@example.com"
                type="email"
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {String(errors.email.message)}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="Phone (optional)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  onValueChange={v => field.onChange(v)}
                  value={String(field.value)}
                >
                  <SelectTrigger aria-label="Status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">New</SelectItem>
                    <SelectItem value="1">Talking</SelectItem>
                    <SelectItem value="2">Won</SelectItem>
                    <SelectItem value="3">Lost</SelectItem>
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
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}