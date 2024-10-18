import express, { Request, Response, Router } from "express";
import swaggerUi from "swagger-ui-express";

import { generateOpenAPIDocument } from "./opeAPIDocumentGenerator";

export const openAPIRouter: Router = (() => {
  const router = express.Router();
  const opeAPIDocument = generateOpenAPIDocument();

  router.get("/swagger.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(opeAPIDocument);
  });

  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(opeAPIDocument));
  return router;
})();
