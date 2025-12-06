import { Hono } from "hono";
import { auth } from "./lib/auth";

const app = new Hono().basePath("/api");

app
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  .get("/", (c) => {
    return c.text("Hello Hono!");
  });

export default app;
