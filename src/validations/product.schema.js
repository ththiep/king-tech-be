import { z } from "zod";

export const productSchema = {
  // POST /api/v1/products
  create: z.object({
    body: z.object({
      name: z.string().min(1, "Product name is required"),
      description: z.string().optional(),
      price: z.coerce.number().min(0, "Price cannot be negative"),
      category: z.string().optional(),
      sku: z.string().optional(),
      stock: z.coerce.number().int().min(0).default(0),
      unit: z.string().optional(),
      status: z.enum(["active", "inactive"]).default("active"),
    }),
  }),

  // PUT/PATCH /api/v1/products/:id
  update: z.object({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      price: z.coerce.number().min(0).optional(),
      category: z.string().optional(),
      sku: z.string().optional(),
      stock: z.coerce.number().int().min(0).optional(),
      unit: z.string().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    }),
  }),
};
