import { parseIbStatement, ParseResult } from "../parser/index.js";
import { AppError } from "../utils/AppError.js";

export const parserService = {
  parse(input: string | Buffer, filename?: string): ParseResult {
    if (!input || (typeof input === "string" && input.trim() === "")) {
      throw AppError.badRequest("Empty input. Provide a proper CSV/XLSX file");
    }
    return parseIbStatement(input, filename);
  },
};
