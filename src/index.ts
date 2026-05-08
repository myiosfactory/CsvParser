import { createApp } from "./app.js";
import { env } from "./config/index.js";

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`IB CSV parser listening on http://localhost:${env.port} (${env.nodeEnv})`);
});

function shutdown(signal: string): void {
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close((err) => {
    if (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});

export default app;
