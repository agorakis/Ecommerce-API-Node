import { Router } from "express";
import { errorHandler } from "../error-handler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { authMiddleware } from "../middlewares/auth";
import {
  addItemToCart,
  changeQuantity,
  deleteCartItem,
  getUserCart,
} from "../controllers/cart";
import { AuthHeadersSchema } from "../schema/users";
import {
  AddCartSchema,
  CartByIdSchema,
  CartItemSchema,
  ChangeQuantitySchema,
  GetCartSchema,
} from "../schema/cart";

export const cartRegistry = new OpenAPIRegistry();
cartRegistry.register("Cart", CartItemSchema);

const cartRouter: Router = Router();

cartRegistry.registerPath({
  method: "get",
  path: "/cart",
  tags: ["Cart"],
  description: "This endpoint returns cart items of the logged in user",
  summary: "Get cart items of user",
  request: {
    headers: AuthHeadersSchema,
  },
  responses: {
    200: {
      description: "Cart items retrieved successfully",
      content: {
        "application/json": {
          schema: GetCartSchema,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
  },
});

cartRouter.get("/", [authMiddleware], errorHandler(getUserCart));

cartRegistry.registerPath({
  method: "delete",
  path: "/cart/{id}",
  tags: ["Cart"],
  description:
    "This endpoint delete specific product by id of the logged in user cart",
  summary: "Delete procuct from cart by id",
  request: {
    headers: AuthHeadersSchema,
    params: CartByIdSchema.shape.params,
  },
  responses: {
    200: {
      description: "Product deleted successfully",
      content: {
        "application/json": {
          schema: CartItemSchema,
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

cartRouter.delete("/:id", [authMiddleware], errorHandler(deleteCartItem));

cartRegistry.registerPath({
  method: "post",
  path: "/cart",
  tags: ["Cart"],
  description:
    "This endpoint allows a logged in user to add products in the cart",
  summary: "Add product to cart",
  request: {
    headers: AuthHeadersSchema,
    body: {
      content: { "application/json": { schema: AddCartSchema } },
    },
  },
  responses: {
    201: {
      description: "Product successfully added",
      content: {
        "application/json": {
          schema: CartItemSchema,
        },
      },
    },
    400: {
      description: "Invalid input",
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
    404: {
      description: "Product not found",
    },
  },
});

cartRouter.post("/", [authMiddleware], errorHandler(addItemToCart));

cartRegistry.registerPath({
  method: "put",
  path: "/cart/{id}",
  tags: ["Cart"],
  description: "This endpoint updates the quantity of a cart item",
  summary: "Updates quantity of a cart item",
  request: {
    headers: AuthHeadersSchema,
    params: ChangeQuantitySchema.shape.params,
    body: {
      content: {
        "application/json": { schema: ChangeQuantitySchema.shape.body },
      },
    },
  },
  responses: {
    200: {
      description: "Quantity updated successfully",
      content: {
        "application/json": {
          schema: CartItemSchema,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
  },
});

cartRouter.put("/:id", [authMiddleware], errorHandler(changeQuantity));

export default cartRouter;
