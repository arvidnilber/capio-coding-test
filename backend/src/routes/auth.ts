import { createRoute, OpenAPIHono, z, type Hook } from "@hono/zod-openapi";
import { sign, verify } from "hono/jwt";
import { openDB } from "../db.js";
import { randomInt } from "crypto";
import type { Database } from "sqlite";
import { defaultHook } from "../utils.js";

const tags = ["auth"];

const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const AuthResponseSchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
  refreshTokenExp: z.number(),
  accessTokenExp: z.number(),
});

const loginRoute = createRoute({
  path: "/login",
  method: "post",
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthResponseSchema,
        },
      },
      description: "Login",
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({ error: z.string() }),
        },
      },
      description: "Wrong credentials",
    },
  },
});

const RefreshRequestSchema = z.object({
  refreshToken: z.string(),
});

const refreshRoute = createRoute({
  path: "/refresh",
  method: "post",
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: RefreshRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthResponseSchema,
        },
      },
      description: "Refresh response",
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({ error: z.string() }),
        },
      },
      description: "Wrong credentials",
    },
  },
});

export const authRouter = new OpenAPIHono({ defaultHook });

const testUser = {
  username: "testuser",
  password: "secret",
  userId: 123,
};

authRouter.openapi(loginRoute, async (c) => {
  const { username, password } = c.req.valid("json");

  if (!(username === testUser.username && password === testUser.password)) {
    return c.json({ error: "Wrong credentials" }, 401);
  }

  const userId = testUser.userId;
  const db = await openDB();

  const user = await db.get("SELECT * FROM users WHERE userId = ?", [userId]);
  if (!user) {
    await db.run(
      "INSERT INTO users(userId, username, phone) VALUES (?, ?, ?)",
      [userId, testUser.username, ""]
    );
  }

  const { refreshToken, accessToken, refreshTokenExp, accessTokenExp } =
    await createTokens(db, userId);

  return c.json(
    {
      refreshToken,
      accessToken,
      refreshTokenExp,
      accessTokenExp,
    },
    200
  );
});

authRouter.openapi(refreshRoute, async (c) => {
  const { refreshToken: refreshTokenFromRequest } = c.req.valid("json");

  let userId = null;

  try {
    const payload = await verify(refreshTokenFromRequest, refreshTokenKey);
    userId = payload.userId as number;
  } catch (e) {
    return c.json({ error: "Invalid refreshToken" }, 401);
  }

  if (!userId) {
    return c.json({ error: "Invalid refreshToken" }, 401);
  }

  const db = await openDB();

  const tokenExistsInDb = await db.get("SELECT * FROM tokens WHERE token = ?", [
    refreshTokenFromRequest,
  ]);

  if (!tokenExistsInDb) {
    return c.json({ error: "Invalid refreshToken" }, 401);
  }

  await db.run("DELETE FROM tokens WHERE token = ?", [refreshTokenFromRequest]);

  const { refreshToken, accessToken, refreshTokenExp, accessTokenExp } =
    await createTokens(db, userId);

  return c.json(
    {
      refreshToken,
      accessToken,
      refreshTokenExp,
      accessTokenExp,
    },
    200
  );
});

const refreshTokenKey = "super-secret-refresh-key";
const accessTokenKey = "super-secret-key";

async function createTokens(db: Database, userId: number) {
  const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // Token expires in 30 days
  const refreshPayload = {
    sub: userId,
    userId,
    exp: refreshTokenExp,
  };
  const refreshToken = await sign(refreshPayload, refreshTokenKey);
  await db.run("INSERT INTO tokens(token) VALUES (?)", [refreshToken]);

  const accessTokenExp = Math.floor(Date.now() / 1000) + 60 * 5; // Token expires in 5 minutes
  const payload = {
    sub: userId,
    userId,
    exp: accessTokenExp,
  };
  const accessToken = await sign(payload, accessTokenKey);

  return {
    refreshToken,
    accessToken,
    refreshTokenExp,
    accessTokenExp,
  };
}
