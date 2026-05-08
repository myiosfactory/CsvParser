import multer from "multer";
import { env } from "../config/index.js";

const ALLOWED_MIME = new Set([
  "text/csv",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/octet-stream",
]);

const ALLOWED_EXT = /\.(csv|xlsx|xls)$/i;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype) || ALLOWED_EXT.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype || file.originalname}`));
    }
  },
});
