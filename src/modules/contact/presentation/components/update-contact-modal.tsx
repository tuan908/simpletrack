"use client";

import {
  UpdateContactForm,
  updateContactInput,
} from "@/api/trpc/schemas/contact";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Contact, ContactStatus } from "../../domain/Contact";
import { statusOptions } from "../../infra/contact.constant";
import { useCreateContactNote } from "../hooks/useCreateContactNote";
import { useUpdateContact } from "../hooks/useUpdateContact";
import { NoteForm } from "./note-form";

interface UpdateContactModalProps {
  contact: Contact;
  open: boolean;
  onClose: (open: boolean) => void;
}

export function UpdateContactModal(props: UpdateContactModalProps) {
  const { contact, open, onClose } = props;
  const { updateContact, loading: updateLoading } = useUpdateContact();
  const { createNote, loading: createNoteLoading } = useCreateContactNote();
  const loading = updateLoading || createNoteLoading;
  const {
    register,
    handleSubmit,
    control,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<UpdateContactForm>({
    resolver: zodResolver(updateContactInput),
    defaultValues: {
      id: "",
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
        id: contact?.id ?? "",
        name: contact?.name ?? "",
        company: contact?.company ?? "",
        email: contact?.email ?? "",
        phone: contact?.phone ?? "",
        status: contact?.status ?? ContactStatus.New,
      });
    }
  }, [contact]);

  async function onSubmit(values: UpdateContactForm) {
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
          <input className="hidden" {...register("id")} />
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
                  onValueChange={(v) => field.onChange(Number(v))}
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

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Add Note</h3>
          {contact?.id && (
            <NoteForm
              contactId={contact.id}
              onSave={(contactId, type, content) =>
                createNote({ contactId, type: type as any, content })
              }
              loading={loading}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
