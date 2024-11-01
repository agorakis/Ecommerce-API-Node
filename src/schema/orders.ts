import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { ProductSchema } from "./products";

extendZodWithOpenApi(z);

const StatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);

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
  status: StatusEnum,
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

export const GetAllOrdersSchema = z.object({
  query: z.object({
    skip: z.number(),
    take: z.number(),
    status: StatusEnum.optional(),
  }),
  response: z.object({
    OrderSchema,
  }),
});

export const GetUserOrdersSchema = z.object({
  params: z.object({ id: z.number() }),
  query: z.object({
    status: StatusEnum.optional(),
  }),
  response: z.object({
    OrderSchema,
  }),
});

export const UpdateOrderStatusSchema = z.object({
  params: z.object({ id: z.number() }),
  body: z.object({
    status: StatusEnum,
  }),
  response: z.object({
    OrderSchema,
  }),
});
