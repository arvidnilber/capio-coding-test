import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from '@scalar/hono-api-reference'

import packageJSON from "../package.json" with { type: "json" };
import { accountRouter } from "./routes/account.js";
import { authRouter } from "./routes/auth.js";

export const app = new OpenAPIHono();

 app.doc("/openapi", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Auth API",
    },
    security: [{ httpBearer: [] }],
  });

  app.get(
    "/reference",
    Scalar({
      url: "/openapi",
      theme: "kepler",
      layout: "modern",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
      authentication: {
        preferredSecurityScheme: 'httpBearer',
          securitySchemes: {
            httpBearer: {
              token: 'xyz token value'
            },
          }
      }
    }),
  );

app.route("/", authRouter);
app.route("/", accountRouter);
