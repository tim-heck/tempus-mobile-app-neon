import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";
import { tasks } from "./routes/tasks.router";
import { HonoEnv } from "./types";

const app = new Hono<HonoEnv>().basePath("/api");

// Enable CORS
app.use(
  "/api/auth/*",
  cors({
    origin: ["exp://localhost:3000", "tempus://"], // Add your Expo dev and app schemes
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    credentials: true, // Important for cookies
  })
);

// // Grant access to user and session
// app.use("*", async (c, next) => {
//   const session = await auth.api.getSession({ headers: c.req.raw.headers });
//   console.log("SESSION*", session);
//   if (!session) {
//     // c.set("user", null);
//     // c.set("session", null);
//     await next();
//     return;
//   }
//   c.set("user", session.user);
//   c.set("session", session.session);
//   await next();
// });

// Better Auth handles all authentication routes
app
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  .route("/tasks", tasks);

serve(app);
