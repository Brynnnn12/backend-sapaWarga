import { Router } from "express";
import { login } from "../controllers/auth/login.controller.js";
import { register } from "../controllers/auth/register.controller.js";
import { loginSchema } from "../validations/auth/login.validation.js";
import { registerSchema } from "../validations/auth/register.validation.js";
import { validate } from "../middewares/validate.middleware.js";
import { authRateLimit } from "../middewares/rateLimit.middleware.js";

const router = Router();

router.post("/login", authRateLimit, validate(loginSchema), login);
router.post("/register", authRateLimit, validate(registerSchema), register);

export default router;
