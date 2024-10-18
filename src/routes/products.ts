import { Router } from "express";
import { errorHandler } from "../error-handler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { CreateProductSchema, ProductSchema } from "../schema/products";
import { createProduct } from "../controllers/products";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";

export const productRegistry = new OpenAPIRegistry();
productRegistry.register("Product", ProductSchema);

const productsRouter: Router = Router();

productRegistry.registerPath({
  method: "post",
  path: "/products",
  tags: ["Products"],
  description: "This endpoint allows a admin user to create a product",
  summary: "Create a new product",
  request: {
    body: { content: { "application/json": { schema: CreateProductSchema } } },
  },
  responses: {
    201: {
      description: "User successfully created",
      content: {
        "application/json": {
          schema: ProductSchema,
        },
      },
    },
    400: {
      description: "Invalid input ",
    },
  },
});

productsRouter.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);

export default productsRouter;
