import { Request, Response } from "express";
import { parserService } from "../services/parser.service.js";
import { AppError } from "../utils/AppError.js";
import { AppResponse } from "../utils/AppResponse.js";

export const parseController = {
  parse(req: Request, res: Response): void {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const file = files[0];

    let input: string | Buffer | null = null;
    let filename: string | undefined;

    if (file?.buffer) {
      input = file.buffer;
      filename = file.originalname;
    } else if (typeof req.body === "string" && req.body.length > 0) {
      input = req.body;
    }

    if (!input) {
      throw AppError.badRequest(
        "No file provided. Send multipart/form-data with a file field, or a text/csv body.",
      );
    }

    const result = parserService.parse(input, filename);
    return AppResponse.send(
      res,
      200,
      "Successfully generated JSON format from CSV/XLSX file",
      result
    );
  },
};
