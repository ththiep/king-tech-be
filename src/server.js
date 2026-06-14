import { config } from "./config/index.js";
import { app } from "./app.js";
import { logger } from "./utils/logger.js";

const server = app.listen(config.port, config.host, () => {
  logger.info(`King Tech backend (Express) listening on http://${config.host}:${config.port} (${config.env})`);
});

function shutdown(signal) {
  server.close(() => {
    logger.info(`Received ${signal}, server closed cleanly`);
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
