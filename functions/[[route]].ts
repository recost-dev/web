import { Hono } from "hono";
import type { AppContext } from "../src/env";
import { corsMiddleware } from "../src/middleware/cors";
import { requestIdMiddleware } from "../src/middleware/request-id";
import { requestLoggingMiddleware } from "../src/middleware/logging";
import { requireJsonContentType } from "../src/middleware/content-type";
import { errorHandler, notFoundHandler } from "../src/middleware/error-handler";
import healthRoutes from "../src/routes/health";
import projectRoutes from "../src/routes/projects";
import providerRoutes from "../src/routes/providers";

const app = new Hono<AppContext>();

app.use("*", corsMiddleware);
app.use("*", requestIdMiddleware);
app.use("*", requestLoggingMiddleware);
app.use("*", requireJsonContentType);

app.get("/", (c) =>
  c.json({
    data: {
      name: "API Usage Analyzer",
      message: "API is running.",
      resources: ["/health", "/projects", "/providers"]
    }
  })
);

app.route("/", healthRoutes);
app.route("/", projectRoutes);
app.route("/", providerRoutes);

app.notFound(notFoundHandler);
app.onError(errorHandler);

export const onRequest: PagesFunction<AppContext["Bindings"]> = (ctx) =>
  app.fetch(ctx.request, ctx.env);
