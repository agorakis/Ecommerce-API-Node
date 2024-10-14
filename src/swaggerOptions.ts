import { URL } from "./secrets";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce-API",
      version: "1.0.0",
      description: "Ecommerce-API documentation",
    },
    servers: [
      {
        url: URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/routes/**/*.ts"], // Path to your API routes
};
