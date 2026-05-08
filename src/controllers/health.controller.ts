import { Request, Response } from "express";

export const healthController = {
  check(_req: Request, res: Response): void {
    res.json({ success: true, uptime: process.uptime(), timestamp: new Date().toISOString() });
  },
};
