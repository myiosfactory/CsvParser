import express, { Application } from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { env } from "./config/index.js";

export function createApp(): Application {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors());
  app.use(express.text({ type: ["text/csv", "text/plain"], limit: `${env.maxUploadMb}mb` }));
  app.use(requestLogger);

  app.use("/v1/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
