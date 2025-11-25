import { ContactStatus } from "@/modules/contact/domain/Contact";
import z from "zod";
import { contactNoteTypeEnum } from "@/infra/db/schema/note";

export const createContactInput = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Invalid email",
    }),
  phone: z.string().optional(),
  status: z.enum(ContactStatus),
});

export type CreateContactForm = z.infer<typeof createContactInput>;

export const updateContactInput = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Invalid email",
    }),
  phone: z.string().optional(),
  status: z.enum(ContactStatus),
});

export type UpdateContactForm = z.infer<typeof updateContactInput>;

export const deleteContactInput = z.object({
  id: z.string().min(1, "ID is required"),
});

export type DeleteContactForm = z.infer<typeof deleteContactInput>;

export const createContactNoteInput = z.object({
  contactId: z.string().min(1, "Contact ID is required"),
  content: z.string().min(1, "Note content cannot be empty"),
  type: z.enum(contactNoteTypeEnum.enumValues),
});

export type CreateContactNoteForm = z.infer<typeof createContactNoteInput>;

export const updateContactNoteInput = z.object({
  id: z.string().min(1, "ID is required"),
  contactId: z.string().min(1, "Contact ID is required"),
  content: z.string().min(1, "Note content cannot be empty"),
  type: z.enum(contactNoteTypeEnum.enumValues),
});

export type UpdateContactNoteForm = z.infer<typeof updateContactNoteInput>;
