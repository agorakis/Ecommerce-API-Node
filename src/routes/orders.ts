import { Router } from "express";
import { errorHandler } from "../error-handler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { authMiddleware } from "../middlewares/auth";
import { AuthHeadersSchema } from "../schema/users";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orders";
import {
  GetAllOrdersSchema,
  GetOrdersSchema,
  GetUserOrdersSchema,
  OrderByIdSchema,
  OrderSchema,
  UpdateOrderStatusSchema,
} from "../schema/orders";
import { adminMiddleware } from "../middlewares/admin";

export const orderRegistry = new OpenAPIRegistry();
orderRegistry.register("Order", OrderSchema);

const ordersRouter: Router = Router();

orderRegistry.registerPath({
  method: "get",
  path: "/orders",
  tags: ["Orders"],
  description: "This endpoint returns all the orders of the logged in user",
  summary: "Get all orders of the logged in user",
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
      description: "Order not found",
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

orderRegistry.registerPath({
  method: "get",
  path: "/orders/index",
  tags: ["Orders"],
  description: "This endpoint returns all the orders to the admin user",
  summary: "Get all orders",
  request: {
    headers: AuthHeadersSchema,
    query: GetAllOrdersSchema.shape.query,
  },
  responses: {
    200: {
      description: "Orders retrieved successfully",
      content: {
        "application/json": {
          schema: GetAllOrdersSchema.shape.response,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
  },
});

ordersRouter.get(
  "/index",
  [authMiddleware, adminMiddleware],
  errorHandler(getAllOrders)
);

orderRegistry.registerPath({
  method: "get",
  path: "/orders/users/{id}",
  tags: ["Orders"],
  description:
    "This endpoint returns orders of specific user by id to the admin user",
  summary: "Get user by id orders",
  request: {
    headers: AuthHeadersSchema,
    params: GetUserOrdersSchema.shape.params,
    query: GetUserOrdersSchema.shape.query,
  },
  responses: {
    200: {
      description: "Orders retrieved successfully",
      content: {
        "application/json": {
          schema: GetUserOrdersSchema.shape.response,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
  },
});
ordersRouter.get(
  "/users/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getUserOrders)
);

orderRegistry.registerPath({
  method: "put",
  path: "/orders/{id}/status",
  tags: ["Orders"],
  description:
    "This endpoint updates the status of specific order by id to the admin user",
  summary: "Update order by id status",
  request: {
    headers: AuthHeadersSchema,
    params: UpdateOrderStatusSchema.shape.params,
    body: {
      content: {
        "application/json": { schema: UpdateOrderStatusSchema.shape.body },
      },
    },
  },
  responses: {
    200: {
      description: "Order status updated successfully",
      content: {
        "application/json": {
          schema: UpdateOrderStatusSchema.shape.response,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
    404: {
      description: "Order not found",
    },
  },
});

ordersRouter.put(
  "/:id/status",
  [authMiddleware, adminMiddleware],
  errorHandler(updateOrderStatus)
);

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
      description: "Order not found",
    },
  },
});

ordersRouter.get("/:id", [authMiddleware], errorHandler(getOrderById));

export default ordersRouter;
