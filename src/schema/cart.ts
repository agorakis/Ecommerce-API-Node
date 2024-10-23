import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { ProductSchema } from "./products";

extendZodWithOpenApi(z);

export const CartItemSchema = z.object({
  id: z.number(),
  userId: z.number(),
  productId: z.number(),
  quantity: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AddCartSchema = z.object({
  productId: z.number(),
  quantity: z.number(),
});

export const CartByIdSchema = z.object({
  params: z.object({ id: z.number() }),
});

export const GetCartSchema = z.object({
  id: z.number(),
  userId: z.number(),
  productId: z.number(),
  quantity: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  product: ProductSchema,
});
