import { z } from "zod";

export const SingUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
});
