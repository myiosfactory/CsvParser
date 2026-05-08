/**
 * Operational error with an HTTP status code.
 * Throw these from controllers/services to produce a clean 4xx/5xx response.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly data: null;
  public readonly success: boolean;
  public readonly errors: unknown[];

  constructor(
    statusCode: number,
    success: boolean,
    message: string = "Something went wrong",
    errors: unknown[] = [],
    stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace?.(this, this.constructor);
    }
  }

  static badRequest(message: string, errors: unknown[] = []) {
    return new AppError(400, false, message, errors);
  }

  static unsupportedMediaType(message: string) {
    return new AppError(415, false, message);
  }

  static payloadTooLarge(message: string) {
    return new AppError(413, false, message);
  }

  static internal(message = "Internal server error") {
    return new AppError(500, false, message);
  }
}
