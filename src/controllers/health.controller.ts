import { Request, Response } from "express";
import { AppResponse } from "../utils/AppResponse.js";

export const healthController = {
  check(_req: Request, res: Response): void {
    AppResponse.send(res, 200, "OK", {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  },
};
