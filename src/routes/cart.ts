import { Router } from "express";
import { errorHandler } from "../error-handler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { authMiddleware } from "../middlewares/auth";
import { addItemToCart } from "../controllers/cart";
import { AuthHeadersSchema } from "../schema/users";
import { AddCartSchema, CartItemSchema } from "../schema/cart";

export const cartRegistry = new OpenAPIRegistry();
cartRegistry.register("Cart", CartItemSchema);

const cartRouter: Router = Router();

// userRegistry.registerPath({
//   method: "get",
//   path: "/users/address",
//   tags: ["Users"],
//   description: "This endpoint returns all the addresses of the logged in user",
//   summary: "Get all addresses of user",
//   request: {
//     headers: AuthHeadersSchema,
//   },
//   responses: {
//     201: {
//       description: "Addresses retrieved successfully",
//       content: {
//         "application/json": {
//           schema: GetAddressesSchema,
//         },
//       },
//     },
//     401: {
//       description: "Unauthorized, invalid or missing token",
//     },
//   },
// });

// usersRouter.get("/address", [authMiddleware], errorHandler(getUserAddresses));

// userRegistry.registerPath({
//   method: "delete",
//   path: "/users/address/{id}",
//   tags: ["Users"],
//   description:
//     "This endpoint delete specific address by id of the logged in user",
//   summary: "Delete address by id",
//   request: {
//     headers: AuthHeadersSchema,
//     params: AddressByIdSchema.shape.params,
//   },
//   responses: {
//     201: {
//       description: "Address deleted successfully",
//       content: {
//         "application/json": {
//           schema: AddressSchema,
//         },
//       },
//     },
//     401: {
//       description: "Unauthorized, invalid or missing token",
//     },
//     404: {
//       description: "Product not found",
//     },
//   },
// });

// usersRouter.delete(
//   "/address/:id",
//   [authMiddleware],
//   errorHandler(deleteAddress)
// );

cartRegistry.registerPath({
  method: "post",
  path: "/cart",
  tags: ["Cart"],
  description:
    "This endpoint allows a logged in user to add products in the cart",
  summary: "Add products to cart",
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

// userRegistry.registerPath({
//   method: "put",
//   path: "/users",
//   tags: ["Users"],
//   description:
//     "This endpoint updates user's name and shipping & billing addresses",
//   summary: "Updates user",
//   request: {
//     headers: AuthHeadersSchema,
//     body: {
//       content: {
//         "application/json": { schema: UpdateUserSchema },
//       },
//     },
//   },
//   responses: {
//     200: {
//       description: "User updated successfully",
//       content: {
//         "application/json": {
//           schema: UserSchema,
//         },
//       },
//     },
//     401: {
//       description: "Unauthorized, invalid or missing token",
//     },
//     404: {
//       description: "Address not found",
//     },
//   },
// });

// usersRouter.put("/", [authMiddleware], errorHandler(updateUser));

export default cartRouter;
