import { parseIbStatement, ParseResult } from "../parser/index.js";
import { AppError } from "../utils/AppError.js";

/**
 * Service layer: orchestrates business logic on top of the parser library.
 * Controllers should call into this, never into the library directly.
 */
export const parserService = {
  parse(input: string | Buffer, filename?: string): ParseResult {
    if (!input || (typeof input === "string" && input.trim() === "")) {
      throw AppError.badRequest("Empty input. Provide a proper CSV/XLSX file");
    }
    return parseIbStatement(input, filename);
  },
};
