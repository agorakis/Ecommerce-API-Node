import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number().gt(0, { message: "Price must be greater than 0" }),
  tags: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GetProductsSchema = z.object({
  query: z.object({ skip: z.number(), take: z.number() }),
  response: z.object({
    count: z.number(),
    products: z.array(ProductSchema),
  }),
});

export const ProductByIdSchema = z.object({
  params: z.object({ id: z.number() }),
});

export const UpdateCreateProductSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number().gt(0, { message: "Price must be greater than 0" }),
    tags: z.array(z.string()),
  }),
});
