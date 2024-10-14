import express, { Express, json } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = express();

app.use(json());
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({ log: ["query"] });

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening in port ${PORT}...`);
});
