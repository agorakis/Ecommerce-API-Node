import { Router } from "express";
import { errorHandler } from "../error-handler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  UpdateCreateProductSchema,
  ProductByIdSchema,
  GetProductsSchema,
  ProductSchema,
  SearchProductsSchema,
} from "../schema/products";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  searchProducts,
  updateProduct,
} from "../controllers/products";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";
import { AuthHeadersSchema } from "../schema/users";

export const productRegistry = new OpenAPIRegistry();
productRegistry.register("Product", ProductSchema);

const productsRouter: Router = Router();

productRegistry.registerPath({
  method: "get",
  path: "/products/search",
  tags: ["Products"],
  description: "This endpoint search products for login user",
  summary: "Search products",
  request: {
    headers: AuthHeadersSchema,
    query: SearchProductsSchema.shape.query,
  },
  responses: {
    200: {
      description: "Search products retrieved successfully",
      content: {
        "application/json": {
          schema: SearchProductsSchema.shape.response,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
  },
});
productsRouter.get("/search", [authMiddleware], errorHandler(searchProducts));

productRegistry.registerPath({
  method: "get",
  path: "/products",
  tags: ["Products"],
  description: "This endpoint returns all the products to the admin user",
  summary: "Get all products",
  request: {
    headers: AuthHeadersSchema,
    query: GetProductsSchema.shape.query,
  },
  responses: {
    200: {
      description: "Products retrieved successfully",
      content: {
        "application/json": {
          schema: GetProductsSchema.shape.response,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
    404: {
      description: "Product not found",
    },
  },
});

productsRouter.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(getProducts)
);

productRegistry.registerPath({
  method: "get",
  path: "/products/{id}",
  tags: ["Products"],
  description: "This endpoint returns specific product by id to the admin user",
  summary: "Get product by id",
  request: {
    headers: AuthHeadersSchema,
    params: ProductByIdSchema.shape.params,
  },
  responses: {
    200: {
      description: "Product retrieved successfully",
      content: {
        "application/json": {
          schema: ProductSchema,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
    404: {
      description: "Product not found",
    },
  },
});

productsRouter.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getProductById)
);

productRegistry.registerPath({
  method: "delete",
  path: "/products/{id}",
  tags: ["Products"],
  description: "This endpoint delete specific product by id to the admin user",
  summary: "Delete product by id",
  request: {
    headers: AuthHeadersSchema,
    params: ProductByIdSchema.shape.params,
  },
  responses: {
    200: {
      description: "Product deleted successfully",
      content: {
        "application/json": {
          schema: ProductSchema,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
    404: {
      description: "Product not found",
    },
  },
});

productsRouter.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);

productRegistry.registerPath({
  method: "post",
  path: "/products",
  tags: ["Products"],
  description: "This endpoint allows a admin user to create a product",
  summary: "Create a new product",
  request: {
    headers: AuthHeadersSchema,
    body: {
      content: { "application/json": { schema: UpdateCreateProductSchema } },
    },
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
      description: "Invalid input",
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
  },
});

productsRouter.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);

productRegistry.registerPath({
  method: "put",
  path: "/products/{id}",
  tags: ["Products"],
  description: "This endpoint updates specific product by id to the admin user",
  summary: "Updates product by id",
  request: {
    headers: AuthHeadersSchema,
    params: ProductByIdSchema.shape.params,
    body: {
      content: {
        "application/json": { schema: UpdateCreateProductSchema.shape.body },
      },
    },
  },
  responses: {
    200: {
      description: "Product updated successfully",
      content: {
        "application/json": {
          schema: ProductSchema,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
    404: {
      description: "Product not found",
    },
  },
});

productsRouter.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);

export default productsRouter;
