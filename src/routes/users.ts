import { Router } from "express";
import { errorHandler } from "../error-handler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { authMiddleware } from "../middlewares/auth";
import {
  AddressByIdSchema,
  AddressSchema,
  AuthHeadersSchema,
  GetAddressesSchema,
  UpdateUserSchema,
  UserSchema,
} from "../schema/users";
import {
  createAddress,
  deleteAddress,
  getUserAddresses,
  updateUser,
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
    200: {
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
    200: {
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
      description: "Address not found",
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

userRegistry.registerPath({
  method: "put",
  path: "/users",
  tags: ["Users"],
  description:
    "This endpoint updates user's name and shipping & billing addresses",
  summary: "Updates user",
  request: {
    headers: AuthHeadersSchema,
    body: {
      content: {
        "application/json": { schema: UpdateUserSchema },
      },
    },
  },
  responses: {
    200: {
      description: "User updated successfully",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
    404: {
      description: "Address not found",
    },
  },
});

usersRouter.put("/", [authMiddleware], errorHandler(updateUser));

export default usersRouter;
