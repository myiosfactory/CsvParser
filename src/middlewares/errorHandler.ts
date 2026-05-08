import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "../utils/AppError.js";
import { NotAnIbStatementError } from "../parser/index.js";
import { isProd } from "../config/index.js";

interface ErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    stack?: string;
  };
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
  let code = "INTERNAL_ERROR";
  let message = "Internal server error";
  let details: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof NotAnIbStatementError) {
    statusCode = 400;
    code = "INVALID_STATEMENT";
    message = err.message;
  } else if (err instanceof multer.MulterError) {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    code = err.code;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  const body: ErrorBody = { success: false, error: { code, message } };
  if (details !== undefined) body.error.details = details;
  if (!isProd && err instanceof Error && err.stack) body.error.stack = err.stack;

  if (statusCode >= 500) {
    console.error("[error]", err);
  }

  res.status(statusCode).json(body);
}
