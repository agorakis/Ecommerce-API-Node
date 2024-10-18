import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number().gt(0, { message: "Price must be greater than 0" }),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateProductSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number().gt(0, { message: "Price must be greater than 0" }),
    tags: z.array(z.string()),
  }),
});
