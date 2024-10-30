import { Router } from "express";
import { errorHandler } from "../error-handler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { authMiddleware } from "../middlewares/auth";
import { AuthHeadersSchema } from "../schema/users";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
} from "../controllers/orders";
import {
  GetOrdersSchema,
  OrderByIdSchema,
  OrderSchema,
} from "../schema/orders";

export const orderRegistry = new OpenAPIRegistry();
orderRegistry.register("Order", OrderSchema);

const ordersRouter: Router = Router();

orderRegistry.registerPath({
  method: "get",
  path: "/orders",
  tags: ["Orders"],
  description: "This endpoint returns all the orders to the login user",
  summary: "Get all orders",
  request: {
    headers: AuthHeadersSchema,
  },
  responses: {
    200: {
      description: "Orders retrieved successfully",
      content: {
        "application/json": {
          schema: GetOrdersSchema,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
  },
});

ordersRouter.get("/", [authMiddleware], errorHandler(getOrders));

orderRegistry.registerPath({
  method: "get",
  path: "/orders/{id}",
  tags: ["Orders"],
  description: "This endpoint returns specific order by id to the login user",
  summary: "Get order by id",
  request: {
    headers: AuthHeadersSchema,
    params: OrderByIdSchema.shape.params,
  },
  responses: {
    200: {
      description: "Order retrieved successfully",
      content: {
        "application/json": {
          schema: OrderByIdSchema.shape.response,
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

ordersRouter.get("/:id", [authMiddleware], errorHandler(getOrderById));

orderRegistry.registerPath({
  method: "put",
  path: "/orders/{id}/cancel",
  tags: ["Orders"],
  description: "This endpoint cancel specific order by id to the login user",
  summary: "Cancel order by id",
  request: {
    headers: AuthHeadersSchema,
    params: OrderByIdSchema.shape.params,
  },
  responses: {
    200: {
      description: "Order cancelled successfully",
      content: {
        "application/json": {
          schema: OrderSchema,
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
ordersRouter.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));

orderRegistry.registerPath({
  method: "post",
  path: "/orders",
  tags: ["Orders"],
  description: "This endpoint allows a login user to create an order",
  summary: "Create a new order",
  request: {
    headers: AuthHeadersSchema,
  },
  responses: {
    201: {
      description: "Order successfully created",
      content: {
        "application/json": {
          schema: OrderSchema,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
  },
});

ordersRouter.post("/", [authMiddleware], errorHandler(createOrder));

export default ordersRouter;
