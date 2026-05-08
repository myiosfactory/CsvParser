import { Router } from "express";
import { parseController } from "../controllers/parse.controller.js";
import { upload } from "../middlewares/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", upload.any(), asyncHandler(async (req, res) => parseController.parse(req, res)));

export default router;
