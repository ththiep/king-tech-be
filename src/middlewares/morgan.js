import morgan from "morgan";
import { logger } from "../utils/logger.js";

const stream = {
  // Bắn dữ liệu ghi nhận từ Morgan sang Winston với level "info"
  write: (message) => logger.info(message.trim()),
};

// Morgan sẽ tự động ghi lại Method, URL, Status, Độ dài Payload và Thời gian phản hồi
export const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream }
);
