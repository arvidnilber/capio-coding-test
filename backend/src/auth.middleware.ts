import { jwt } from "hono/jwt";

export const authMiddleware = jwt({ secret: "super-secret-key" });
