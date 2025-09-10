import { serve } from "@hono/node-server";
import { app } from "./app.js";

const PORT = 3000;

serve({ fetch: app.fetch, port: PORT });

console.log(`Auth API is running on port ${PORT}`);
console.log(`See documentation on: http://localhost:${PORT}/reference`);
console.log("See README.md for more information");
