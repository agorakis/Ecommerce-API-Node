import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { ProductSchema } from "./products";

extendZodWithOpenApi(z);

export const OrderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  netAmount: z.number(),
  address: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const EventSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  status: z.enum([
    "PENDING",
    "ACCEPTED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GetOrdersSchema = z.array(OrderSchema);

export const OrderByIdSchema = z.object({
  params: z.object({ id: z.number() }),
  response: z.object({
    OrderSchema,
    products: z.array(ProductSchema),
    events: z.array(EventSchema),
  }),
});
