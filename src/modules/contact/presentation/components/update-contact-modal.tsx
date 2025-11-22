"use client";

import { SubmitButton } from "@/core/components/submit-button";
import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startTransition, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Contact, ContactStatus } from "../../domain/Contact";
import { statusOptions } from "../../infra/contact.constant";

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
  status: z.enum(ContactStatus),
});

type ContactForm = z.infer<typeof contactSchema>;

interface UpdateContactModalProps {
  contact: Contact;
  open: boolean;
  onClose: (open: boolean) => void;
}

export function UpdateContactModal(props: UpdateContactModalProps) {
  const { contact, open, onClose } = props;
  const queryClient = useQueryClient();

  const { mutateAsync: updateContact, isPending: loading } = useMutation({
    mutationFn: async (data: ContactForm) => {
      const res = await api.patch<
        Result<{ id: string }, Array<{ error: string }>>
      >("/contacts", {
        id: contact.id,
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
    if (contact) {
      reset({
        name: contact?.name ?? "",
        company: contact?.company ?? "",
        email: contact?.email ?? "",
        phone: contact?.phone ?? "",
        status: contact?.status ?? ContactStatus.New,
      });
    }
  }, [contact]);

  async function onSubmit(values: ContactForm) {
    console.log("Submitting", values);
    try {
      startTransition(async () => {
        await updateContact(values);
      });
      onClose(false);
      reset(); // Reset form after successful submission
    } catch (err) {
      // Error is already handled in onError
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Contact</DialogTitle>
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
                  onValueChange={v => field.onChange(Number(v))}
                  value={String(field.value)}
                >
                  <SelectTrigger aria-label="Status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={String(option.value)}>
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
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <SubmitButton
              submitting={loading}
              label="Update"
              loadingLabel="Saving..."
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
