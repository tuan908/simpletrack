import { ContactStatus } from "@/modules/contact/domain/Contact";
import z from "zod";

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
