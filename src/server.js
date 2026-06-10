import { config } from "./config/index.js";
import { app } from "./app.js";

const server = app.listen(config.port, config.host, () => {
  process.stdout.write(
    `King Tech backend (Express) listening on http://${config.host}:${config.port} (${config.env})\n`,
  );
});

function shutdown(signal) {
  server.close(() => {
    process.stdout.write(`Received ${signal}, server closed cleanly\n`);
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
