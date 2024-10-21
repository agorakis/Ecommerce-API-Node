import { Router } from "express";
import { errorHandler } from "../error-handler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { authMiddleware } from "../middlewares/auth";
import {
  AddressByIdSchema,
  AddressSchema,
  AuthHeadersSchema,
  GetAddressesSchema,
  UserSchema,
} from "../schema/users";
import {
  createAddress,
  deleteAddress,
  getUserAddresses,
} from "../controllers/users";

export const userRegistry = new OpenAPIRegistry();
userRegistry.register("User", UserSchema);
userRegistry.register("Address", AddressSchema);

const usersRouter: Router = Router();

userRegistry.registerPath({
  method: "get",
  path: "/users/address",
  tags: ["Users"],
  description: "This endpoint returns all the addresses of the logged in user",
  summary: "Get all addresses of user",
  request: {
    headers: AuthHeadersSchema,
  },
  responses: {
    201: {
      description: "Addresses retrieved successfully",
      content: {
        "application/json": {
          schema: GetAddressesSchema,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
  },
});

usersRouter.get("/address", [authMiddleware], errorHandler(getUserAddresses));

userRegistry.registerPath({
  method: "delete",
  path: "/users/address/{id}",
  tags: ["Users"],
  description:
    "This endpoint delete specific address by id of the logged in user",
  summary: "Delete address by id",
  request: {
    headers: AuthHeadersSchema,
    params: AddressByIdSchema.shape.params,
  },
  responses: {
    201: {
      description: "Address deleted successfully",
      content: {
        "application/json": {
          schema: AddressSchema,
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

usersRouter.delete(
  "/address/:id",
  [authMiddleware],
  errorHandler(deleteAddress)
);

userRegistry.registerPath({
  method: "post",
  path: "/users/address",
  tags: ["Users"],
  description: "This endpoint allows a logged in user to create an address",
  summary: "Create a new address",
  request: {
    headers: AuthHeadersSchema,
    body: {
      content: { "application/json": { schema: AddressSchema } },
    },
  },
  responses: {
    201: {
      description: "Address successfully created",
      content: {
        "application/json": {
          schema: AddressSchema,
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

usersRouter.post("/address", [authMiddleware], errorHandler(createAddress));

export default usersRouter;
