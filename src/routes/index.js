import { Router } from "express";
import authRoute from "./auth.route.js";
import complaintRoute from "./complaint.route.js";
import { generalRateLimit } from "../middewares/rateLimit.middleware.js";

const router = Router();

// General rate limit untuk semua API
router.use(generalRateLimit);

// Register all routes
router.use("/auth", authRoute);
router.use("/complaints", complaintRoute);

export default router;
