import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { openDB } from "../db.js";
import { jwt, type JwtVariables } from "hono/jwt";
import { authMiddleware } from "../auth.middleware.js";
import { defaultHook } from "../utils.js";

const tags = ["account"];

const AccountSchema = z.object({
  userId: z.number(),
  username: z.string(),
  phone: z.string().min(10).max(15),
});

const UpdateAccountSchema = z.object({
  phone: z.string().min(10).max(15),
});

const getAccountRoute = createRoute({
  path: "/account",
  method: "get",
  tags,
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AccountSchema,
        },
      },
      description: "Retrieve the user",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({ error: z.string() }),
        },
      },
      description: "User not found",
    },
  },
});

const patchAccountRoute = createRoute({
  path: "/account",
  method: "patch",
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateAccountSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AccountSchema,
        },
      },
      description: "Update the user",
    },
  },
});

type Variables = JwtVariables;
export const accountRouter = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook,
});

accountRouter.openapi(
  { ...getAccountRoute, middleware: authMiddleware },
  async (c) => {
    const jwtPayload = c.get("jwtPayload");
    const userId = jwtPayload.sub;
    const db = await openDB();

    const user = await db.get("SELECT * FROM users WHERE userId = ?", [userId]);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(
      {
        userId: user.userId,
        username: user.username,
        phone: user.phone,
      },
      200
    );
  }
);

accountRouter.openapi(
  { ...patchAccountRoute, middleware: authMiddleware },
  async (c) => {
    const jwtPayload = c.get("jwtPayload");
    const userId = jwtPayload.sub;
    const { phone } = c.req.valid("json");

    const db = await openDB();
    await db.run("UPDATE users SET phone = ? WHERE userId = ?", [
      phone,
      userId,
    ]);

    const user = await db.get("SELECT * FROM users WHERE userId = ?", [userId]);

    return c.json(
      {
        userId: user.userId,
        username: user.username,
        phone: user.phone,
      },
      200
    );
  }
);
