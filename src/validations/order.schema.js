import { z } from "zod";

export const orderSchema = {
  // POST /api/v1/orders
  create: z.object({
    body: z.object({
      customerId: z.string().optional(),
      customerName: z.string().min(1, "Customer name is required"),
      customerPhone: z.string().optional(),
      items: z.array(z.object({
        productId: z.string(),
        productName: z.string(),
        quantity: z.coerce.number().int().min(1),
        price: z.coerce.number().min(0),
      })).min(1, "Order must have at least 1 item"),
      totalAmount: z.coerce.number().min(0),
      status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).default("pending"),
      note: z.string().optional(),
    }),
  }),
};
