import { Router } from "express";
import { signup, login, me } from "../controllers/auth";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  AuthHeadersSchema,
  AuthSchema,
  LoginSchema,
  SingUpSchema,
  UserSchema,
} from "../schema/users";

export const authRegistry = new OpenAPIRegistry();
authRegistry.register("Auth", AuthSchema);

const authRouter: Router = Router();

authRegistry.registerPath({
  method: "post",
  path: "/auth/signup",
  tags: ["Auth"],
  description: "This endpoint allows a new user to create an account",
  summary: "Create a new user account",
  request: {
    body: { content: { "application/json": { schema: SingUpSchema } } },
  },
  responses: {
    201: {
      description: "User successfully created",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
    400: {
      description: "Invalid input or email already exists",
    },
  },
});

authRouter.post("/signup", errorHandler(signup));

authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  description: "Log in an existing user with email and password",
  summary: "Login user",
  request: {
    body: {
      content: { "application/json": { schema: LoginSchema.shape.body } },
    },
  },
  responses: {
    200: {
      description: "Successful login",
      content: {
        "application/json": {
          schema: LoginSchema.shape.response,
        },
      },
    },
    401: {
      description: "Invalid credentials",
    },
  },
});

authRouter.post("/login", errorHandler(login));

authRegistry.registerPath({
  method: "get",
  path: "/auth/me",
  tags: ["Auth"],
  description:
    "This endpoint retrieves the current user's details if authenticated",
  summary: "Get the logged-in user's details",

  request: {
    headers: AuthHeadersSchema,
  },
  responses: {
    200: {
      description: "Successfully retrieved user details",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
    401: {
      description: "Unauthorized, invalid or missing token",
    },
  },
});

authRouter.get("/me", [authMiddleware], errorHandler(me));

export default authRouter;
