import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "./lib/auth";
import { tasks } from "./routes/tasks.router";

const app = new Hono().basePath("/api");

// Better Auth handles all authentication routes
app
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  .route("/tasks", tasks);

serve(app);
