import { Router } from "express";
import healthRoutes from "./health.routes.js";
import parseRoutes from "./parse.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/parse", parseRoutes);

export default router;
