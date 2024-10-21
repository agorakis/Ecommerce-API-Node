import { Router } from "express";
import authRouter from "./auth";
import productsRouter from "./products";
import usersRouter from "./users";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productsRouter);
rootRouter.use("/users", usersRouter);

export default rootRouter;
