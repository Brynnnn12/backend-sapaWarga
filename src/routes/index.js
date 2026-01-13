import { Router } from "express";
import authRoute from "./auth.route.js";

const router = Router();

// Register all routes
router.use("/auth", authRoute);

export default router;
