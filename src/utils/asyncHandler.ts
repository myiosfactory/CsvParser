import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wrap an async route handler so rejected promises flow into Express's
 * error pipeline (and our global errorHandler) instead of crashing the process.
 */
export function asyncHandler<R extends Request = Request>(
  fn: (req: R, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req as R, res, next)).catch(next);
  };
}
