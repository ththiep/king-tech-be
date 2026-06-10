import { z } from "zod";

export const contactSchema = {
  // POST /api/v1/contacts
  create: z.object({
    body: z.object({
      name: z.string().min(1, "Contact name is required"),
      email: z.string().email("Invalid email format").optional(),
      phone: z.string().min(1, "Phone is required"),
      company: z.string().optional(),
      address: z.string().optional(),
      note: z.string().optional(),
      type: z.enum(["customer", "supplier", "partner", "other"]).default("customer"),
    }),
  }),
};
