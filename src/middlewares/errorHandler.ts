import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "../utils/AppError.js";
import { NotAnIbStatementError } from "../parser/index.js";
import { isProd } from "../config/index.js";

interface ErrorBody {
  success: false;
  message: string;
  data: null;
}

/**
 * Global error handler. Must be the LAST middleware mounted.
 * Maps known error types to clean HTTP responses; hides internals in production.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof NotAnIbStatementError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof multer.MulterError) {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  if (statusCode >= 500) {
    console.error("[error]", err);
    if (isProd) message = "Internal server error";
  }

  const body: ErrorBody = { success: false, message, data: null };
  res.status(statusCode).json(body);
}
