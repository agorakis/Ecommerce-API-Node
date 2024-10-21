import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { authRegistry } from "../routes/auth";
import { productRegistry } from "../routes/products";
import { userRegistry } from "../routes/users";

export const generateOpenAPIDocument = () => {
  const registry = new OpenAPIRegistry([
    authRegistry,
    productRegistry,
    userRegistry,
  ]);

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Ecommerce-API",
      version: "1.0.0",
      description: "Ecommerce-API documentation",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
};
