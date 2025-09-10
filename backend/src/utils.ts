import type { Hook } from "@hono/zod-openapi";

export const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    if (result.error.name === "ZodError") {
      return c.json(
        {
          success: result.success,
          error: {
            name: result.error.name,
            issues: result.error.issues,
          },
          message: "Validation error, see error object",
        },
        400
      );
    }
    return c.json(
      {
        success: result.success,
        error: {
          name: result.error.name,
          issues: result.error.issues,
        },
      },
      400
    );
  }
};
