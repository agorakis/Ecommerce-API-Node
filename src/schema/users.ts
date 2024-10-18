import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export const SingUpSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(5),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  response: z.object({ UserSchema, token: z.string() }),
});

export const AuthHeadersSchema = z.object({
  Authorization: z
    .string()
    .min(1, "Authorization header is required")
    .describe("Token for authorization"),
});
