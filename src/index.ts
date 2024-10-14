import express, { Express, json } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerOptions";

const app: Express = express();

app.use(json());
app.use("/api", rootRouter);

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export const prismaClient = new PrismaClient({ log: ["query"] });

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening in port ${PORT}...`);
});
